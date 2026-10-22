# Open-Source Contributions — Samarth Vala (Proof Book)

> Single source of truth for my open-source work. Every entry is a real, linked PR or issue
> with its status, size, and full write-up (what changed, why, and how it was verified),
> pulled from GitHub. GitHub-UI noise removed; the engineering is kept. Use for resume
> bullets, portfolio case studies, and verifiable proof.

**Totals:** 29 merged PRs · 2 open PRs · 5 issues filed, across 4 projects ·
**Maintainer** at flutter_edge_ai.

| Project | Role | Merged | Open | Issues |
|---|---|---|---|---|
| [flutter_edge_ai](https://github.com/DenisovAV/flutter_edge_ai) | **Maintainer** | 13 | 1 | 5 |
| [webpack](https://github.com/webpack/webpack) | Contributor | 6 | 1 | — |
| [Backstage (CNCF)](https://github.com/backstage/backstage) | Contributor | 4 | — | — |
| [C2SI · Webiu](https://github.com/c2siorg/Webiu) | Contributor | 6 | — | — |

---
---

# 1. flutter_edge_ai — Maintainer & Core Contributor

**Repo:** https://github.com/DenisovAV/flutter_edge_ai ·
**Contributors:** https://flutteredge.ai/contributors · **Role:** Maintainer.

flutter_edge_ai brings **on-device LLM / ML inference to Flutter** — the LiteRT-LM, MediaPipe
and ONNX engines across Android, iOS, macOS, Windows and Linux, running Gemma / FunctionGemma
/ Qwen3 models on CPU, GPU and NPU, over a native C/FFI layer under a Dart API.

**At a glance:** 13 merged PRs · 1 open · 5 issues. Headline: I **designed and shipped
`flutter_gemma_diagnostics`**, a cross-platform memory-diagnostics subsystem for on-device
model inference — from the proposal (#517) through ~10 merged PRs — plus LiteRT-LM engine /
native-FFI correctness fixes and new platform support.

---

## 1A. Memory-diagnostics subsystem (issue #517)

The problem I scoped: there was no way to see how much memory a loaded model actually costs
the app, and a single "RSS" number is misleading (iOS jetsam enforces `phys_footprint`;
Android `lmkd` reacts to device-wide pressure; GPU memory sits outside the heap counters).
I proposed and built an opt-in diagnostics package read purely through `dart:io` + `dart:ffi`
(no Kotlin/Swift/Gradle/podspec, no native channel), then wired it into the example benchmark.

### feat(diagnostics): anonymous footprint and available memory, read from the OS (#517)
`#541` · **MERGED** · +958/−0 · https://github.com/DenisovAV/flutter_edge_ai/pull/541

First part of #517: a new opt-in satellite, `flutter_gemma_diagnostics`, with `anonymousBytes` and `availableBytes` on Android and iOS — the two fields you said would be worth merging on their own. The rest lands incrementally.

#### What it reports

| Field | iOS | Android |
|---|---|---|
| `anonymousBytes` | `phys_footprint` from `task_info(TASK_VM_INFO)`, the value jetsam enforces | `Private_Dirty + SwapPss` from `/proc/self/smaps_rollup` |
| `availableBytes` | `os_proc_available_memory()`: headroom before **this app** hits its limit | `MemAvailable` from `/proc/meminfo`: available on **the whole device** |

`availableBytes` means different things per platform because the platforms enforce memory differently, and the docs say so rather than papering over it.

Every field is nullable, and each documents why it can be null on each platform:
- `smaps_rollup` is missing on kernels older than 4.14.
- `os_proc_available_memory()` returns 0 both when no limit applies (the simulator) and when the limit is already exceeded; the two can't be told apart, so 0 maps to null.

Off Android and iOS, `memorySnapshot()` throws `UnsupportedError` instead of returning nulls.

#### One design decision worth flagging

Everything is read through `dart:io` and `dart:ffi`: `/proc` on Android, Mach and libsystem on iOS. So the package has **no Kotlin, Swift, Gradle or podspec**:
- the KGP concern from #440 doesn't arise;
- it adds no native channel;
- it doesn't depend on `flutter_gemma`, so it can sit in `dev_dependencies` as you suggested.

The API is still `Future`-returning, so `gpuBytes` can later use a platform call (`Debug.MemoryInfo` needs Java) without a signature change. A conditional export keeps the package importable in a web build: it throws there instead of failing to compile on `dart:ffi`.

Per your conventions:
- the package is in the root `workspace:` list;
- `tool/test_all.sh` discovers it on its own;
- the CHANGELOG is one line.

#### Verification

| Check | Result |
|---|---|
| Package tests | 24/24, 0 skipped |
| `tool/test_all.sh` | 13/13 packages pass (the new one discovered automatically) |
| `flutter analyze packages/` | No errors or warnings; the new files report no issues |
| `dart format` | Clean |
| **Android device** (vivo 1933, Android 11, arm64) | **2/2 pass** |

Two host tests read the real `/proc` of the Linux kernel they run on, which Android shares. One of them writes 128 MiB and checks that `anonymousBytes` rises by at least 96 MiB. So the Android parser is exercised against a real kernel in CI, not only against fixtures.

On the Android device, via `flutter test integration_test/diagnostics_memory_test.dart -d <id>`:

```
MemorySnapshot(anonymousBytes: 168221696, availableBytes: 3841175552, ...)
anonymousBytes delta after writing 256 MiB: 268853248
```

It wrote 268,435,456 bytes and measured a rise of 268,853,248 — within 0.16%. That is what convinced me `Private_Dirty + SwapPss` is the right formula, not merely a plausible one.

#### Not yet verified: iOS

I develop on Linux, so I can't build for iOS. The iOS parsing is unit-tested:
- the `phys_footprint` offset is 144 (17 eight-byte fields + 2 four-byte ones);
- the rev-1 count check;
- the 0 → null mapping.

The FFI calls themselves (`task_info`, `mach_task_self_`, `os_proc_available_memory`) have not run on a device, and the README says so. Would you be able to run the same test on an iPhone?

```
flutter test integration_test/diagnostics_memory_test.dart -d <iphone-id>
```

The test tolerates a null `availableBytes` on the simulator, where no jetsam limit applies.

#### Linux

The package declares Android and iOS only, per your scope. For what it's worth, the Android reader already works unchanged on desktop Linux — the host tests prove it — so enabling Linux later would be a one-line change if anyone asks.

#### Next, in follow-up PRs

- `anonymousPeakBytes` (iOS, from `ledger_phys_footprint_peak`)
- `fileBackedBytes` (Android, from `smaps_rollup`)
- experimental `gpuBytes`
- wiring snapshots into the example's benchmark flow next to TTFT and tok/s



---

### test(benchmark): record anonymous memory next to the timings (#517)
`#569` · **MERGED** · +203/−16 · https://github.com/DenisovAV/flutter_edge_ai/pull/569

Part of #517: the benchmark flow now reports memory next to its timings. **It records anonymous memory around every model load and prompt, says which platform and backend produced it, and says plainly what those numbers can and cannot tell you.**

#### What changed
`example/integration_test/benchmark_comparison_test.dart` timed each prompt and recorded nothing about memory. Each result now also carries, read through `flutter_gemma_diagnostics` (already a `dev_dependency` of the example):

```json
"platform": "android",
"backend": {"requested": "gpu", "active": "gpu"},
"memory": {
  "anonymous_bytes": {"before_load": 0, "after_load": 0, "before_prompt": 0, "after_prompt": 0},
  "available_bytes_after_prompt": 0,
  "read_errors": []
}
```

The existing keys and the top-level list shape are unchanged, and each result prints one live line: `load +754.4 MiB, prompt +0.1 MiB (anonymous)`.

- **Load is measured per phase** (each phase loads the model fresh); samples are taken outside the stopwatch window.
- **A failed read is recorded, not thrown.** It must not abort a 60-minute run, but it must not look like "no such value on this platform" either, so each failed sample adds `"<sample>: <error>"` to `read_errors`. A null with no entry means the platform has no such value; a null with an entry means the read failed.
- **`backend.active` is `InferenceModel.activeBackend`**, the backend that ran, fallbacks included. `backend.requested` comes from one constant used by all four `getActiveModel` calls.

#### Read the numbers with these limits (also in the code)
- They are **samples at prompt boundaries, not a high-water mark.** Android keeps no anonymous-only peak.
- On Android `anonymousBytes` **largely excludes GPU-only memory**, and is not zero of it either: on Adreno, KGSL buffers mapped into the CPU (`/dev/kgsl-3d0`) land in `Private_Dirty`. See observation 1.
- `before_load` and `after_load` (and the load's read errors) **repeat in every record of a phase**, so summing deltas across records counts one load once per record.
- `available_bytes` is device-wide `MemAvailable` on Android but per-app headroom on iOS: compare only records with the same `platform` (and `backend`).
- No tokens per second: the benchmark records none today; a follow-up via `session.getSessionMetrics()`.

#### Measured on hardware
vivo 1933, Android 11, 7.8 GB RAM, Gemma 4 E2B (SHA256 verified), `PreferredBackend.gpu`. Full run on the final code: 27:55, 14/14 results, exit 0; every record `android` + `gpu/gpu`, `read_errors` empty; the saved JSON equals what the log printed.

| Phase | before_load | after_load | load Δ | prompt Δ |
|---|---|---|---|---|
| text (5) | 234.8 MiB | 989.1 | +754.4 | -0.5 … +9.8 |
| multi_turn (5) | 270.6 | 1073.9 | +803.4 | -5.6 … +1.6 |
| vision (2) | 257.2 | 1218.4 | +961.2 | **+596.3** (first image), +1.0 |
| audio (2) | 272.3 | 881.2 | +608.9 | +66.4 (first audio), -0.4 |

##### Observations
1. **The same load is not reproducible.** The first load of the same model read +334.5 / +354.4 / +429.6 / +754.4 MiB across four runs. A per-mapping breakdown of `Private_Dirty` (`/proc/<pid>/smaps`, run F only) points at the cause: 570 of the 989 MiB after the first load (58%) were `/dev/kgsl-3d0` mappings, and that share moved 6 → 570 → 656 → 740 MiB over the run, while the non-KGSL share stayed at ~270-520 MiB, apart from the vision phase after the first image (~1,120 MiB, observation 3). So a single-run load delta on Adreno is indicative only. "Likely", not "shown": the earlier runs have no breakdown.
2. **The disk-cache theory is not supported.** `files/` holds a 12.4 MB `*_mldrift_program_cache.bin` and a 336-byte `*_mldrift_weight_cache.bin`; with the cache present from the start (`--no-uninstall`) phase one loaded at +429.6 MiB, not the ~665 it predicts; GPU memory does not accumulate across loads.
3. **The first image costs ~600 MiB of ordinary heap** (anon 364 → 1,132 MiB), not GPU; the second costs nothing.
4. `dumpsys meminfo` sees what `anonymous_bytes` cannot: `Gfx dev` goes 6 → ~1,254 MiB at load and is steady across loads (`GL mtrack` matches it within a few MiB at every sample, which suggests one allocation counted twice).

#### Not verified
- **One model, one device.** Gemma 3n E2B is gated on Hugging Face and I have no token. For the runs I made local, uncommitted edits (`_models` narrowed to Gemma 4 E2B, a print of the JSON), and for the reduced runs also a shortened prompt list and one injected read failure. The committed file is byte-identical to the intended copy. Command: `flutter test integration_test/benchmark_comparison_test.dart -d <device>` from `example/`, with both models under `/data/local/tmp/flutter_gemma_test/`.
- The error path was exercised on the device by injecting one failed `before_prompt` read (local only): console line, `before_prompt: null` plus the `read_errors` entry in the saved JSON, next record clean, run not aborted.
- iOS: the benchmark is Android-only.

#### Checks
- `flutter analyze packages/`: no errors or warnings (the new code adds no `avoid_print` beyond the file's own convention).
- `tool/test_all.sh`: **10 of 13 packages finished locally, all passing, on this exact code** (809, 219, 58, 30, 46, 146, 11, 98, 115 and 121 tests). The run was then stopped by the OS for low memory during `flutter_gemma_speech`, so that package and `genkit_flutter_gemma` / `genkit_hybrid` did not finish locally. This round's diff touches only an example integration test and a pubspec comment, which that script does not run, and the same suite passed 13/13 on this branch before this round; CI runs all 13 on this push. The device runs above are the evidence for the benchmark change itself.

#### Not in here
- The file is not `dart format`-clean on `main`; I did not run the formatter on it, so the diff is the change. The new self-contained code is format-clean.
- `sampled_peak_bytes` (with its interval), tokens per second, `fileBackedBytes`, `gpuBytes`: follow-ups on #517.



---

### test(benchmark): record a sampled peak of anonymous memory per load and prompt (#517)
`#577` · **MERGED** · +744/−276 · https://github.com/DenisovAV/flutter_edge_ai/pull/577

Part of #517, the `sampled_peak_bytes` follow-up from #569: each benchmark record now carries the highest anonymous-memory reading seen during the model load and during the prompt, with the interval that produced it.

#### What changed
`benchmark_comparison_test.dart` adds, next to the existing `memory` fields:

```json
"sampled_peak_bytes": {"load": null, "prompt": null, "interval_ms": 1000, "samples": {"load": 0, "prompt": 0}, "failed": {"load": 0, "prompt": 0}, "read_ms": {"load": null, "prompt": null}}
```

- The peak is the highest of the boundary readings and the periodic reads in that window. `samples` counts the periodic reads that returned a value, `failed` those that failed, `read_ms` is {mean, max} of the successful ones, and `PEAK_INTERVAL_MS=0` turns the sampler off (`interval_ms: null`). 0 samples means boundary readings only.
- The load peak repeats in every record of a phase, like `before_load` / `after_load`.
- Failed periodic reads are summarised once per window in `read_errors`, so a persistent failure cannot flood a record.
- `PeakSampler` is a small class in its own file with 9 host tests (`cd example && flutter test test/benchmark_peak_sampler_test.dart`), breaking it three ways on purpose turned the right tests red.

#### Sampling is not free
One `smaps_rollup` read took ~150 ms on the vivo 1933 (Android 11, kernel 4.9; mean 150-160 ms over ~3,500 reads, max 342 ms), so the interval cannot be small. First-token total of the six prompts against an idle sampler (two runs each):

| | total | text / chat step 1 |
|---|---|---|
| every 250 ms | +3.8% | +14% / +23% |
| every 1,000 ms | **+1.5%** | +2% / +6% |

So the interval is 1 s, and a spike shorter than that can be missed. Two idle runs differ by 1-2% on short prompts and up to 4.8% on the longest, so the total is within noise on long prompts; the short-prompt cost is real.

#### Measured on hardware
vivo 1933, Gemma 4 E2B, GPU, one prompt per path (text, chat, vision, audio), exit 0, saved JSON equal to the log. Every peak is at least its boundary readings, with 5-157 periodic reads behind each prompt peak. On the vision prompts the sampler found 2,104-2,113 MiB where the boundary readings showed 2,089-2,091 MiB.

#### Not verified
- One model, one device (Gemma 3n is gated). The runs used local edits (one model, shorter prompt list, JSON printed) that are not in the commit.
- No full 14-prompt run of this code. The failure-summary path was exercised on the device with two injected failed reads (local only, 250 ms build of the same code).
- `tool/test_all.sh`: 13/13, exit 0, but it does not run the example's tests or this benchmark.

#### Finding for the package (not in this PR)
`memorySnapshot()` is async but reads `/proc` synchronously, so it blocks the calling isolate for the whole ~150 ms read. With asynchronous reads the 250 ms sampler's cost on the short prompts halves (+14% → +7%, +23% → +8%) but the total stays +3.7%, because the read itself is kernel work. I can send that as its own PR if you want it.

#### Not in here
Tokens per second, `fileBackedBytes`, `gpuBytes`. The file is not `dart format`-clean on `main`, so I did not run the formatter on it; my lines are format-clean.




---

### fix(diagnostics): read Android /proc files asynchronously (#517)
`#583` · **MERGED** · +120/−56 · https://github.com/DenisovAV/flutter_edge_ai/pull/583

Part of #517; the package fix the maintainer asked for on #577.

`memorySnapshot()` was `async` but `readProcMemorySnapshot` read both `/proc` files synchronously, so a call from the UI isolate froze it for ~150 ms on a low-end device.

- `_readProcFile` is async with `return await File(path).readAsString();` inside the `try`, so an absent `smaps_rollup` still maps to null.
- The two reads stay sequential. iOS is unchanged (Mach calls, microseconds).
- README: each Android snapshot walks the page tables (~150 ms on a 4.9 kernel, holds `mmap_lock` before 5.10), so don't poll faster than about once a second.
- 0.2.1, one CHANGELOG line.

Verified: analyze clean, 30/30 package tests on Linux (including the real `/proc` group); dropping the `await` fails 4 of them.

Not verified: that the UI isolate is no longer janky on a device. Async moves the wait off the isolate, not the kernel's cost.




---

### test(benchmark): record tokens and decode speed per prompt (#517)
`#594` · **MERGED** · +268/−5 · https://github.com/DenisovAV/flutter_edge_ai/pull/594

Part of #517, the tok/s follow-up the maintainer agreed on #569.

#### What changed
Each benchmark record gets a `tokens` object from the session counters (`session.getSessionMetrics()`):
`input_tokens`, `output_tokens`, `native_tokens_per_second`, `decode_tokens_per_second`, `read_error`.

- A session's counters add up across its turns, so one prompt is the difference between the readings before and after it (matters for the 5-step multi-turn phase).
- `native_tokens_per_second` is the engine's figure for its last decode turn; dropped when the prompt produced no tokens.
- `decode_tokens_per_second` is ours: tokens after the first over the time from the first token to the last one, so it leaves out the prefill that `first_token_ms` already measures and the chat's bookkeeping after the last token (`duration_ms` stays the total).
- The whole `tokens` object is null when the engine reports no counters (MediaPipe returns an empty `SessionMetrics`): null means "this engine does not say", not zero tokens. Counters that went backwards (session recreated) give `read_error`, not a negative rate.
- The arithmetic is a pure function in `benchmark_token_stats.dart`, so it runs on the host.

#### Testing
- 7 host tests in `test/benchmark_token_stats_test.dart`; removing the "went backwards" guard, or the `sameSession` guard, turns its test red. Analyze clean. `example/test/` is not run by CI, so these were run by hand.
- The benchmark keeps the session the "before" reading came from and passes `sameSession: identical(chat.session, session)`; a recreated session gives `read_error`, not a wrong difference.
- MediaPipe, on the vivo with `functiongemma-270M-it.task`: a real prompt streamed 22 chunks and `getSessionMetrics()` returned inputTokens 0, outputTokens 0, ttft null, tps null before and after, so `tokenStatsBetween` gives null and the record's `tokens` is null (checked with a scratch test, not committed).
- Device: vivo 1933, Gemma 4 E2B on GPU, 14/14 records, every `read_error` null (run three times, the last after the `sameSession` and last-token changes). Decode rate 2.5 to 2.9 tok/s across 9 to 1152 output tokens. On the 8 prompts with 100+ tokens the native and our rate agree within 0.1 tok/s.

#### Not verified
- Any device other than the vivo, and the Gemma 3n model (Google's repo is gated, its file is not on the phone, so the run used Gemma 4 only).
- On short answers the two rates differ (first prompt: native 1.9 vs ours 2.9 tok/s on 9 tokens; vision step 1: 2.1 vs 2.5), so the native figure seems to include some prefill there. Treat `decode_tokens_per_second` as the comparable one and `native_tokens_per_second` as the engine's own.

#### Not in here
`fileBackedBytes` and `gpuBytes` stay separate PRs.





---

### feat(diagnostics): report resident clean file pages on Android (#517)
`#600` · **MERGED** · +472/−70 · https://github.com/DenisovAV/flutter_edge_ai/pull/600

First part of #517. `MemorySnapshot.fileBackedBytes` reports resident clean file pages on Android.

#### What changed
- Read `Private_Clean + Shared_Clean` from `/proc/self/smaps_rollup`. A missing rollup file gives null; a present file missing either field throws `MemoryReadException`. The field is null on iOS.
- Add parser, error-path, snapshot equality, and Android/iOS integration assertions.
- Update the diagnostics README, 0.2.2 changelog, diagnostics skill, and site page.

#### Why
`anonymousBytes` excludes clean pages of a mapped model. The vivo's kernel 4.9 does not provide `Pss_File`. In earlier GPU measurements, `Rss - Anonymous` exceeded the clean-page reading by about 190 MiB, so clean pages were the closer measure of resident mapped weights.

#### Testing
- Diagnostics package: 36 tests passed on three consecutive runs; analyzer clean.
- Host kernel test: mapping and reading a synced 64 MiB file raised `fileBackedBytes` without a comparable rise in `anonymousBytes`. Mutations omitting `Shared_Clean` and suppressing the required-field error were caught.
- `flutter test integration_test/diagnostics_memory_test.dart -d 3099b33e` from `packages/flutter_edge_ai/example`: 2/2 passed on vivo 1933 (Android 11). Baseline `fileBackedBytes` was 106 MiB; a 256 MiB allocation raised `anonymousBytes` by 258 MiB.

#### Measured on hardware
| Device / OS | Earlier Gemma 4 E2B measurement |
| --- | --- |
| vivo 1933 / Android 11 | CPU clean pages: ~115 MiB before load, 1082 MiB at load, 1601 MiB after one prompt, ~131 MiB after close. GPU: ~135 MiB before load, 1081 MiB at load, ~130 MiB after close. |

#### Not verified
- iOS device or simulator: the new null assertion has not run there. From `packages/flutter_edge_ai/example`, run `flutter test integration_test/diagnostics_memory_test.dart -d <ios-device-id>`.
- macOS and Android phones other than the vivo were not run for this change.

#### Not in here
- GPU memory accounting and the other diagnostics follow-ups from #517.



---

### feat(diagnostics): anonymousPeakBytes on iOS and macOS, macOS supported (#517)
`#645` · **MERGED** · +406/−85 · https://github.com/DenisovAV/flutter_edge_ai/pull/645

Part of #517: the iOS peak and macOS follow-up listed in the package roadmap.

#### What changed
- `MemorySnapshot.anonymousPeakBytes` (optional, nullable): `ledger_phys_footprint_peak` from the same `task_info(TASK_VM_INFO)` reply as `phys_footprint`. It is the kernel's lifetime high-water mark: never reset, so to attribute a peak to one operation take a snapshot before and treat it as an upper bound. Null on Android (the kernel keeps no anonymous-only peak; `VmHWM` includes file pages), and null on an OS whose reply is too short to contain the field (not a failed read: `phys_footprint` is still there). A failed `task_info` call still throws.
- macOS: `isSupported` is true and `memorySnapshot()` no longer throws there. `anonymousBytes` is the same `phys_footprint` (Activity Monitor's "Memory"); `availableBytes` is null because `os_proc_available_memory()` is iOS-only and macOS has no per-app limit; `fileBackedBytes` stays null. `platforms:` gains `macos`.
- README, CHANGELOG (0.3.0), skill, site page and AGENTS.md updated in the same change, as asked on #583. The roadmap now lists only `gpuBytes`.

#### Testing
- 44/44 package tests on Linux; analyze clean. New parser tests cover the layout (offset 168 = 144 + 8 + 2 * 8, count 44), the peak read, a short reply giving null, a too-small buffer giving null, and a failed call throwing. Reading the wrong offset or removing the short-reply guard turns a test red.
- `diagnostics_memory_test.dart` asserts the supported values (peak not null and at least `anonymousBytes` on iOS and macOS, `availableBytes` null on macOS, the peak null on Android) and that `anonymousBytes` rises by an allocation. The peak is tested in `diagnostics_peak_test.dart`, a file of its own so the first test starts clean: the footprint and the peak follow a first 256 MiB allocation, the peak is bounded above by the footprint (so a virtual-address field such as `max_address` fails), and a second test `mmap`s 256 MiB, `munmap`s it and requires the footprint to fall while the peak stays (so `phys_footprint` itself, offset 144, fails).
- The unsupported-host tests skip on a macOS host, which is now a supported platform.

#### Verified
Run by a friend with a Mac, on an iPhone 17 simulator (iOS 27.0) and macOS 26.6 (Apple Silicon), Xcode 27.0, Flutter 3.47.7, in a standalone app (`flutter create`, a copy of this package, `flutter test -d`):
- **Struct layout, against Apple's SDK header and a compiled `offsetof`:** `phys_footprint` 144, `ledger_phys_footprint_peak` **168**, size 8, so the count is 44 natural_t (`TASK_VM_INFO_REV1_COUNT` 38, `REV2` 42, `REV3` 84). Compile-time assertions against the iOS 27.0 simulator SDK agree.
- **The package's own unit tests on macOS:** 39 passed, 5 skipped (unsupported-host and Linux `/proc` tests, by design).
- **Peak after a free** (malloc 256 MiB, touch, free): the peak stays at the high-water mark on both targets (iOS simulator 355.6 MiB, `anonymousBytes` back to 100.0 MiB; macOS 492.0 MiB).
- **`diagnostics_memory_test.dart`:** 3 of 3 passed on the simulator. On macOS the supported-fields and allocation-delta tests passed, and the peak test failed on its own assertion (see below).
- **App Sandbox is on** for the macOS test app (`com.apple.security.app-sandbox`), ad hoc signed; `task_info` worked under it.

| standalone run | peak before | peak after 256 MiB | `anonymousBytes` delta |
|---|---|---|---|
| iOS simulator | 111,905,216 | 373,410,432 | 256.4 MiB |
| macOS | 180,978,696 | 445,498,568 | 252.3 MiB |

`availableBytes` and `fileBackedBytes` were null on macOS, as designed; `fileBackedBytes` was null on iOS, as designed; `availableBytes` was null on the simulator, which the dartdoc documents (`os_proc_available_memory()` returns 0 there).

**The two repository test files, run again on the review version** (`c7d27b95`, the commit before this rebase; a friend's Mac, macOS 26.6, Xcode 27.0, Flutter 3.47.7, standalone app, `flutter test -d`, each file in its own test process): `diagnostics_memory_test.dart` and `diagnostics_peak_test.dart` passed **5 of 5 runs each on macOS** and once each on the iPhone 17 simulator (iOS 27.0), 12 runs and 24 test cases, no failures. The `munmap` case held every time: the footprint fell after release while the peak stayed.

| | peak test run | footprint before → during → after `munmap` | peak after |
|---|---|---|---|
| macOS (run 1) | first allocation: peak 224,789,536 → 487,163,104 (footprint the same) | 221,250,616 → 489,833,696 → 221,283,384 | 489,833,696 |
| iOS simulator | first allocation: peak 111,364,544 → 372,918,888 (footprint 103,631,272 → 372,918,888) | 373,688,936 → 642,321,216 → 373,738,088 | 642,321,216 |

The rebase onto `main` after #646 changed only the docs conflict resolutions: the code and test changes are identical to the tested commit (compared hunk by hunk).

**Review follow-up on the peak test:** the earlier assertion `peak >= before.anonymousBytes + 192 MiB` failed on macOS when the whole file ran, because an earlier test's block had been collected or reused; the review reproduced it on the iOS 26.5 simulator. It now lives in its own file with the original lower bound and the two extra checks above. The macOS and simulator runs above are of the current version.

#### Not verified
- **A real iPhone.** The simulator has no per-app limit, so `availableBytes` on a device and the jetsam behaviour are not exercised (unchanged by this PR).
- **A hardened-runtime or notarized macOS app.** Only the ad hoc signed debug app under App Sandbox was run.
- The 44/44 package tests listed under Testing ran on Linux; the 39 above are the same files on macOS.

#### Not in here
`gpuBytes`, and iOS `fileBackedBytes` from `TASK_VM_INFO.external`, are separate.







---

### docs(diagnostics): fileBackedBytes also counts GPU driver buffers on Adreno (#517)
`#646` · **MERGED** · +34/−13 · https://github.com/DenisovAV/flutter_edge_ai/pull/646

Part of #517. Doc-only correction to #600, found while checking whether a `gpuBytes` is feasible.

#### What was wrong
The docs describe `fileBackedBytes` as "resident clean pages, mostly mapped files". That holds on a CPU backend. On a GPU backend on Adreno it does not: the driver's buffers are mapped into the process through `/dev/kgsl-3d0`, and they are almost all clean pages, so they land in `Private_Clean` and are counted as "file-backed".

#### Evidence
vivo 1933 (Adreno 616, Android 11, kernel 4.9), Gemma 4 E2B `.litertlm`, `maxTokens: 1024`, one prompt. An in-app probe summed `/proc/self/smaps` mappings by path and I sampled `dumpsys meminfo` from the host at the same moment:

| MiB | CPU run | GPU run |
|---|---|---|
| smaps `/dev/kgsl-3d0` Pss (after one prompt; 981 after load) | 6 | 988 |
| smaps `/dev/kgsl-3d0` Private_Dirty | 6 | 115 |
| dumpsys `Gfx dev` | 6.2 | 989 (Private Clean 873, Private Dirty 116) |
| dumpsys `GL mtrack` | 5.5 | 990 |
| smaps `.litertlm` mapping, resident (Pss) | 172 | 179 |
| smaps all other file mappings (`.so`, other files), Pss | about 870 | about 85 |

The mapping fell back to 6 MiB when the model closed. On the GPU run the kgsl mapping (988) is much larger than every mapped file together (about 260 MiB Pss), so most of the clean pages `fileBackedBytes` counts there are GPU buffers. About 115 MiB of the kgsl mapping is dirty and already in `anonymousBytes`, so only its clean part is double-counted into this field. One run per backend on one device. The `Private_Clean + Shared_Clean − (Rss − Anonymous)` check in the README could not see this, because kgsl pages are in both terms.

#### What changed
One paragraph ("GPU backends") in the `fileBackedBytes` dartdoc, the package README, the skill and the site page, plus the field description in AGENTS.md, and the one-line summary changed from "mostly mapped files" to "mapped files on a CPU backend, and GPU driver buffers on some GPU backends". No code, no version bump, no CHANGELOG line: that is yours to decide for a doc-only change.

#### Verified
Package tests 36/36, `dart analyze` clean, `dart format` clean, and `dart doc --validate-links` reports 0 warnings and 0 errors (nothing but dartdoc comments changed in `lib/`).

#### Not verified
- **Mali** (Pixel, Galaxy A series, Dimensity): not measured. Its GPU memory comes through different nodes (dmabuf heaps, `/dev/mali0`), so I make no claim about it; the text says so.
- Adreno on a 5.x kernel and on other Adreno generations: one device only.
- iOS: unchanged; the text says nothing about it.

#### Not in here
A `gpuBytes` field. The same measurement says a pure-Dart one is feasible on Adreno (the smaps total matches dumpsys within 0.2%), but that is a design question for you first.




---

### feat(diagnostics): experimental gpuMemory(), the GPU memory mapped into the process (#517)
`#669` · **MERGED** · +772/−21 · https://github.com/DenisovAV/flutter_edge_ai/pull/669

Part of #517: an experimental GPU memory reading. Reshaped after the review: a separate call instead of a `MemorySnapshot` field, so the snapshot and its null contract are unchanged.

#### What changed
- `FlutterEdgeAiDiagnostics.gpuMemory()` (`@experimental`) returns `GpuMemoryReading?`. Null = no reader for this device (iOS and macOS, not read yet; an Android process with no `kgsl-3d0` mapping, e.g. Mali, not measured). Off Android/iOS/macOS it throws `UnsupportedError`, like `memorySnapshot`.
- `GpuMemoryReading`: `source` (`adrenoKgslMappings`), `inAnonymousBytes` (kgsl `Private_Dirty`, already in `anonymousBytes`), `inFileBackedBytes` (kgsl `Private_Clean + Shared_Clean`, already in `fileBackedBytes`, exactly what the README tells people to subtract), `outsideSnapshotBytes` (always null for now), `takenAt`.
- Parser (`kgslTotalsFromSmaps`): `kgsl-3d0` matched anywhere in the name (covers `/kgsl-3d0` and ` (deleted)`, as AOSP's libmeminfo does); `smaps` read as Latin-1; a kgsl mapping without `Private_Dirty`/`Private_Clean`/`Shared_Clean`, a unit other than `kB`, a header-looking line that is not a header, and no header at all each throw (`MemoryReadException` from the reader). A `\r` in a path no longer hides where a mapping ends.
- Docs: README, site, skill (description and null list), `AGENTS.md`, `## Unreleased` CHANGELOG line. The docs now say it covers only the mapped part of GPU memory, the Metal sentence is corrected (not read yet; `ledger_tag_graphics_footprint` and `MTLDevice.currentAllocatedSize` exist), and the cost text is consistent.

#### Verified
- **Unit tests, 63 pass.** Mutants killed: `startsWith` instead of `contains`, UTF-8 instead of Latin-1, no end-of-mapping check. A fourth (the ` (deleted)` strip) survived because `contains` already covers it, so I removed the strip.
- **Device, vivo 1933 (Adreno 616, Android 11, kernel 4.9), FunctionGemma 270M on the GPU, screen on:** reading 340,736 kB dirty + 22,344 kB clean = 363,080 kB; `dumpsys meminfo` Gfx dev 363,080 kB, GL mtrack 365,960 kB, Graphics 749,592 kB. So the reading equals Gfx dev and is about half of Graphics. Before loading: 6.5 MB dirty, 0 clean. The read took 408 ms with the model loaded.
- **Device test** (`diagnostics_memory_test.dart`): non-null exactly when `/proc/self/maps` contains `kgsl-3d0`, and the parts match an independent hand sum of `Pss`; passes on the vivo.

#### Not verified
- **Kernel 6.6+ Adreno** (the `/kgsl-3d0` name): covered by tests from AOSP's rule, not run on such a device.
- **Which of `page_alloc` ≈ Gfx dev + GL mtrack or ≈ Gfx dev holds:** `/sys/class/kgsl` is permission-denied for an app on the vivo, so `outsideSnapshotBytes` stays null and the question is open.
- Mali, other Adreno GPUs, iOS and macOS.
- The scan runs on the calling isolate (documented).



---

### Feature: memory diagnostics (phys_footprint / anonymous vs file-backed / GPU) for loaded models *(issue)*
`#517` · **CLOSED** · https://github.com/DenisovAV/flutter_edge_ai/issues/517

#### Problem

There is no way to see how much memory a loaded model actually costs the app.

- The LiteRT-LM engine surfaces TTFT and tokens/s (`litert_lm_benchmark_info_*` via `getSessionMetrics`), but nothing about memory.
- Process memory (VmHWM / RSS) is only read inside a few integration tests, e.g. the OpenCL leak test and the ONNX device smoke test.
- Choosing a model for a given device therefore relies on manifest notes and trial and error: "iPhone / 8 GB phones excluded", "~2 GiB single-section mmap budget on iOS".

The numbers users need are also not the obvious ones, especially on mobile:

- **iOS**: jetsam enforces `phys_footprint` (anonymous + compressed + IOKit/Metal). Clean file-backed (mmap'd) weight pages are *not* counted.
- **Android**: lmkd reacts to overall pressure. RSS/PSS include file-backed pages, and GPU memory lives outside the heap counters.

A single "RSS" number is misleading on both.

#### Proposal

A small, opt-in, debug-oriented memory probe (no change to existing APIs):

```dart
final snap = await FlutterGemmaDiagnostics.memorySnapshot();
// snap.anonymousBytes      iOS phys_footprint; Android Private_Dirty + SwapPss (smaps_rollup)
// snap.anonymousPeakBytes  iOS phys_footprint peak; Android max of sampled values (VmHWM also counts file pages)
// snap.fileBackedBytes     resident file-backed pages (Android smaps_rollup; iOS best effort)
// snap.gpuBytes            Android graphics/GL where available; null otherwise
// snap.availableBytes      os_proc_available_memory() / ActivityManager.MemoryInfo
```

The example app's benchmark flow could then report peak memory across **load, prefill and decode** next to the existing TTFT and tok/s.

#### Why

- Users can pick models and `maxTokens` per device with data instead of guesswork.
- Maintainers can catch memory regressions (e.g. the OpenCL per-turn leak class) outside dedicated tests.
- It is a prerequisite for any future work on larger models or memory budgets.

I'd be glad to implement this.



---


## 1B. LiteRT-LM engine & native-FFI fixes

### fix(litertlm): FunctionGemma bundles with no prefer_activation_type run on the GPU at float32 (#552)
`#657` · **MERGED** · +753/−50 · https://github.com/DenisovAV/flutter_edge_ai/pull/657

Supersedes #558 (taken over as discussed there; a fresh branch from `main`, as the review suggested). Oxygenesis diagnosed it and found the knob (FP32 through the existing `activationDataType`), so the commit carries a `Co-authored-by` for them. Fixes #552.

#### What changed
- **The rule, in `LiteRtLmEngine.createModel`**, for a GPU attempt only:
  - an explicit `activationDataType` wins (float16 included);
  - a CPU or NPU attempt is left alone;
  - a bundle that declares `prefer_activation_type` in any `TFLiteModel` section is left alone;
  - `ModelType.functionGemma` with no key gets `float32`, logged once with how to override.
  Every other family is untouched, and a bundle header that cannot be read is not guessed about.
- **Keyed on the bundle, not the filename.** `litertlmDeclaresActivationType` (`lib/src/litertlm_bundle_activation.dart`) walks the container header with the existing `LitertlmFlatBuffer`: a few hundred bytes to a few KB, once per model load, no section data. It is only read when the answer can matter (no explicit value, not CPU, FunctionGemma).
- **Dropped** from #558: `verifiedBackends` / `resolveRuntimeBackend`, so an explicit backend still always wins.
- **Codelab and site:** Steps 1–3 and the complete app pass `activationDataType: ActivationDataType.float32` instead of pinning the CPU, as the review asked (it works with the released packages). `ModelChoice` gets an `activationDataType`; the site page and its snippets follow.
- **Docs:** a Troubleshooting entry in the litertlm README (native only, log in debug builds, and that a plain `gemma3-270m-it` floods `<pad>` on the GPU too and needs `activationDataType: float32` explicitly, LiteRT-LM#3280), one CHANGELOG line under `## Unreleased` (no version bump), and the `activationDataType: null` descriptions in core (`platform_types.dart`, `interface.dart`, `flutter_edge_ai.dart`, `runtime_config.dart`) and the inference skill now name the FunctionGemma exception.

#### Verified
- **Bundle headers, real ones** (`test/ffi/fixtures`): the FunctionGemma 270M file the codelab downloads (sha256 `680fead1…`) declares no `prefer_activation_type`; Gemma 3 1B and Qwen3 0.6B declare none; Gemma 4 E2B declares it on its prefill/decode and vision sections.
- **Unit tests:** the reader on the four real headers (a truncated header is a `FormatException`), the read result (a missing file and a non-bundle are unknown and carry the error, which the engine prints once per load), the rule's table, and the gate: `gpuActivationDefault` over backend (null, gpu, npu, cpu) x family (functionGemma, gemmaIt, gemma4) x declares (true, false, null), plus `activationHeaderMatters`, which is what decides that the header is read at all. Mutation check: four mutants of the gate and rule, among them narrowing the CPU exclusion to `!= gpu` (which breaks the call with no backend), each fail the suite. Package suite 570 passed, 19 skipped.
- **On a device, GPU, Adreno 616 (vivo 1933, Android 11)**, `functiongemma-270M-it.litertlm`, one engine per case (`integration_test/litertlm_functiongemma_gpu_activation_test.dart`, re-run after the review changes):

| case | `activation_data_type` sent | result |
|---|---|---|
| explicit float16 (the control) | 1 | `calls=[]`, `text=""` |
| no `activationDataType` | 0 (float32), the engine's log line printed | `multiply{a: 12, b: 12}`, text "The result is 144." |
| explicit float32 | 0 | the same |

  `activeBackend` was `gpu` in all three, so none fell back to CPU. The first test builds the float16 control and the default one and prints INCONCLUSIVE when float16 also answers, because FunctionGemma answers at the default on Adreno 750 and Mali (#552); on this device it did not answer, so the default case is shown to fix something. The iOS Simulator skips both when the model is not on the GPU.

- **The rest of the device matrix I can run here, on the same Adreno 616** (`litertlm_native_tools_test.dart` with `TOOLS_BACKEND=gpu`): the two FunctionGemma tool flows (call `multiply`, read the result back; the example app's call-then-tool-response) and the two Gemma 4 E2B ones (including the openSession switch) pass. The rule's log line appears for FunctionGemma and not for Gemma 4, and Gemma 4 is created with no `activationDataType`, as intended.
- **Workspace:** `tool/test_all.sh` is green for all 16 packages and both example apps, on this branch.
- **Codelabs:** Steps 1, 2, 3 and `complete` resolve against the released packages and analyze with no issues; `complete` and Step 1 build as debug APKs.
- **One native crash seen, not reproduced:** the first run of the FunctionGemma GPU case died with a SIGSEGV in a Dart worker right after `litert_lm_engine_create` started (float32, GPU; `Fatal signal 11 (SIGSEGV), code 1 (SEGV_MAPERR), fault addr 0x7700002fb1 in tid 12166 (DartWorker)`). The next run, and every later one (about 15 more FunctionGemma GPU engine creations, including after the review changes), passed, and the crash buffer was gone by the time it was asked for. I will attach `adb logcat -b crash -d` if it happens again.

#### Not verified
- **Other GPUs.** The flood was reported on Adreno 750, Mali-G715 and Mali-G68 (#552); I have one Adreno 616. The test prints INCONCLUSIVE where float16 also answers. You said you would run Adreno 750, Mali-G715 and macOS Metal before publishing; the test file is the same one.
- **iOS Metal, macOS and desktop WebGPU:** the rule is not platform-specific (the codelab notes the same flood on macOS Metal), but I ran Android only.
- **NPU:** left alone on purpose (the reviewed rule says "CPU → leave it"); FP32 on NPU is unknown to me.
- **The gated Mobile Actions file** (`mobile_actions_q8_ekv1024.litertlm`, 401 for me): the public FunctionGemma file has the same header shape, but the Mobile Actions bundle itself was not run.





---

### fix(litertlm): StreamProxy resolves the chunk accessors through a recorded handle and fails closed (#453)
`#668` · **MERGED** · +492/−341 · https://github.com/DenisovAV/flutter_edge_ai/pull/668

Supersedes #556, taken over from Oxygenesis (inactive since Oct 10; the branch is not writable for me, so this is a new PR with a `Co-authored-by` for them). Fixes the design problems in your review there; part of #453, so it only takes effect with the next native rebuild.

#### What changed (`stream_proxy.c`)
- **The handle is recorded once.** `stream_proxy_load_global` and a new `stream_proxy_record_handle` record the first handle that resolves `litert_lm_engine_create`, and never clear or replace it; a failed or unrelated load does not touch it. This also covers iOS and macOS, where the Dart client never called `stream_proxy_load_global`: it now passes `lib.handle` of the library it drives.
- **The accessors are resolved through that handle** (`dlsym(handle, …)` / `GetProcAddress`), under one lock (`pthread_mutex_t`, `SRWLOCK` on Windows: the Windows build has no `<stdatomic.h>`). A negative is not cached while no handle is recorded; a recorded handle without the full set is a permanent miss.
- **Each proxy carries its own copy of the three accessors**, so LiteRT-LM's execution thread never reads a global, and nothing is rewritten after the first resolution.
- **No legacy 4-arg branch.** No accessors, or a partial set, makes `stream_proxy_create` return NULL and clear `*out_proxy_fn`.
- **No filename test**: the control symbol decides, so there is no `strstr` over the path.
- **Dart:** `litert_lm_client.dart` records the handle it drives (guarded with `providesSymbol`, so an older StreamProxy is left alone) and throws a `StateError` that names the likely causes when `stream_proxy_create` returns NULL; the message points at #447 and #453 rather than "flutter_gemma".
- **Windows exports:** the three `litert_lm_stream_chunk_*` accessors are named in the `.def`, so a tree that stops exporting them fails the link.
- Docs: the two agent notes and the `AGENTS.md` row that said the probe was still ambient. No CHANGELOG line and no version bump, as you said.

#### Verified
- **C, on the host, under ThreadSanitizer** (`native/litert_lm/stream_proxy_test.c` with `fake_litert_lm.c`; commands in its header): eight scenarios, each its own process: a full set works and `""` is no error; no handle is not cached; an unrelated library first; a partial set; no accessors; the handle is never cleared; a stream running while three threads load and create; a cold start with four threads. All pass and TSan is silent. Mutants: caching the negative, accepting a partial set, and removing the lock each fail a scenario (the lock-less build gives 3 TSan reports on the cold start in all 3 runs).
- **Android, on a vivo 1933 (Adreno 616), with the shim built by the NDK 28.2 and staged as a local prebuilt:** the example app's APK carries `stream_proxy_record_handle`, and the FunctionGemma 270M tool test (`litertlm_native_tools_test.dart`, call `multiply` and read the result back) passes on GPU and on CPU. The crash buffer stayed empty and the screen was on throughout.
- litertlm package tests 581 passed, 19 skipped; analyze and format clean on the touched Dart files.

#### Not verified
- **The NULL path on a device**: the Dart `StateError` has no test, because the failure needs a bundle with a broken export table; the C side of it is covered by the host test.
- **Windows** (the `SRWLOCK` branch, the `.def` link), **iOS, macOS and Linux**: not built or run; the host test is POSIX only and ran on Linux x86_64.
- **The stream-while-loading case on Android** (a TTS or embedder load during a generation): the host test models it, the device run does not.
- A published StreamProxy still probes the ambient scope until a rebuild carries this file; `litert_default_scope.dart` keeps its check for that reason.



---

### docs(litertlm): the conversation handle doc promised concurrency it does not provide (#516)
`#540` · **MERGED** · +11/−5 · https://github.com/DenisovAV/flutter_edge_ai/pull/540

Fixes #516. Comment-only; no behaviour change.

The class doc for `LiteRtLmConversationHandle` described what the handle *is* — per-conversation ownership, every native call routed through the private `_…On(conv, …)` methods — and then drew a conclusion from it that does not hold: that the LiteRT-LM C API supports multiple `LiteRtLmConversation*` per engine, and that this is what makes concurrent sessions possible.

The ownership half was accurate and is kept. The inference was not: the engine allows one live conversation at a time (upstream LiteRT-LM #966), and concurrency comes from the virtual-session multiplexer tearing the conversation down and rebuilding it with replayed history.

Per the two asks in the issue:

1. **Guarantees are stated separately from what is not guaranteed.** The first paragraph is ownership and lifetime; a second paragraph says plainly that the handle does not give simultaneity, and why.
2. **`#966` is cited from the class doc.** A reader now meets the constraint where they start, instead of having to reach `createConversationHandle` (:931) or `_virtualConv` (:1341) to learn it exists.

`dart format` clean.



---


## 1C. Platform support

### fix(litertlm): say so when Windows ARM64 has no native archive (#326)
`#654` · **MERGED** · +112/−3 · https://github.com/DenisovAV/flutter_edge_ai/pull/654

Supersedes #560, taken over as agreed there (the branch is not writable for me, so this is a new PR). Oxygenesis's commit is kept with its authorship; the follow-up commit addresses the three review points. Relates to #326.

#### What changed
- The LiteRT-LM hook says so while building when the target is **Windows ARM64**, where it has no archive and the app would otherwise build green and fail at `DynamicLibrary.open` (error 126). The build stays non-fatal.
- **Scoped to Windows ARM64.** `android_x86_64` and `macos_x86_64` are slices of ordinary builds whose arm64 half works, and the hooks runner prints a hook's stderr at SEVERE, so they stay silent. The decision lives in `missingArchiveNotice()` (`lib/src/hook/unsupported_target.dart`), because `hook/build.dart` has a `main` and cannot be imported by a test.
- **The text names what exists today:** upstream has no Windows ARM64 LiteRT-LM, MediaPipe has no desktop engine, ONNX is Windows x64 only, so an x64 build under emulation. The README gets a Troubleshooting entry and the Platforms row says "x64"; CHANGELOG has one line.
- Rebased onto the `flutter_edge_ai_litertlm` rename; the message prefix is the package name.

#### Testing
- 3 new unit tests (`test/hook/unsupported_target_test.dart`): Windows ARM64 gets the notice with the cause, the options and `issues/326`; `android_x86_64` and `macos_x86_64` get nothing; the seven targets that ship an archive get nothing.
- The real hook, run with `testCodeBuildHook` (temporary probe, not committed), on a Linux host and again on Windows 11 x64 (Flutter 3.47.7, commit `e7cca9ee`) with the same results:

  | target | notice | code assets |
  |---|---|---|
  | `windows/arm64` | printed | 0, build succeeds |
  | `windows/x64` | none | 24 (archive downloaded and checksum-verified) |
  | `android/x64`, `macos/x64` | none | 0 |
  | `android/arm64`, `linux/x64`, `ios/arm64`, `macos/arm64` (Linux host only) | none | 5, 7, 4, 2 |
- Package hook tests 55/55 (`test/hook`) on Linux and on Windows; `dart analyze` and `dart format` clean on the touched files.

#### Not verified
- A real `flutter build windows` on a Windows ARM64 machine: the Windows PC used is x64, so how the SEVERE line looks in the Flutter output is not seen.
- That an x64 build actually runs under emulation on Windows ARM64: the wording follows the review comment on #560, and I have not tried it.
- The full `tool/test_all.sh` (only the litertlm hook tests and the new ones were run).

#### Other PRs by the same contributor
They also have #556, #558 and #568 open, with no activity since Oct 10. @DenisovAV, may I take those over as well, on the same terms as this one? I have not reviewed their contents yet and would read each before pushing anything.

#### Not in here
The ONNX Windows ARM64 archives are #568; this changes no support claims, downloads or engine selection.





---

### feat(onnx): add Windows ARM64 native archives (#326)
`#656` · **OPEN** · +83/−41 · https://github.com/DenisovAV/flutter_edge_ai/pull/656

Supersedes #568, taken over as discussed there: rebased onto the `flutter_edge_ai_onnx` rename with Oxygenesis's commit cherry-picked, authorship kept. Relates to #326.

**Draft until it has run on Windows ARM64 hardware**, as you set on #568. The README, site and `AGENTS.md` say "bundled, hardware smoke test pending" rather than "device-verified". Everything else is in place so it can be marked ready the moment the two checks below pass.

#### What changed
- `hook/build.dart`: a `windows_arm64` bundle: ORT 1.27.0 `onnxruntime-win-arm64` and ORT-GenAI 0.14.0 `onnxruntime-genai-win-arm64` (the same pins as the other platforms), with the SHA-256 digests and the in-archive DLL paths.
- `OnnxEngine._isSupportedHost` and `OnnxEmbeddingBackend._isSupportedHost` accept `Abi.windowsArm64`, in lockstep with the hook table; the decline and `StateError` texts list it.
- Docs in the same change, as asked on #583: package README, `AGENTS.md` (onnx bullet, key-files row, current version), `website/content/docs/{onnx,installation,packages}.md` and the onnx skill list Windows ARM64 as bundled, hardware smoke test pending. Package 0.6.0 (0.5.9 is already on main), one CHANGELOG line.
- The LiteRT-LM Windows ARM64 notice from #654 (and its README entry and test) no longer say the ONNX engine is x64 only: they point to `flutter_edge_ai_onnx` and say it has not run on ARM64 hardware yet; the x64-under-emulation option is kept.

#### Verified (Linux host, no ARM64 hardware)
- Both archives downloaded from Microsoft's releases: SHA-256 equals the pins (`a32f2650…952f`, `b6daeedb…3f1b`).
- The DLLs the hook extracts are ARM64 builds: PE machine `0xAA64` for `onnxruntime.dll` (15,495,520 bytes) and `onnxruntime-genai.dll` (6,052,664 bytes).
- The real hook, run with `testCodeBuildHook` for `windows/arm64` (temporary probe, not committed): downloads, verifies the checksums in the hook, and returns the 2 code assets (`onnxruntime.dll`, `onnxruntime-genai.dll`). `windows/x64` still returns its 2.
- Rebased on main 2026-10-20: 151 onnx package tests pass (4 skipped, by design); the litertlm hook tests 55/55; `tool/check_skills.dart` clean; `dart format` clean; `dart analyze`: only the 8 existing info lints in onnx, none in the touched files.

#### Verified on Windows 11 x64 (i5-12450H, 16 GB, 2026-10-20; branch head `7d9851ef`)
- **Real hook, both targets:** `windows/x64` and `windows/arm64` each return 2 code assets; the ARM64 run downloads `onnxruntime-win-arm64-1.27.0.zip` and `onnxruntime-genai-0.14.0-win-arm64.zip` and both checksums verify.
- **PE machine type read on Windows:** the two ARM64 DLLs are `AA64` (`onnxruntime.dll` 15,495,520 B, `onnxruntime-genai.dll` 6,052,664 B), the two x64 DLLs `8664`.
- **Tests:** litertlm hook tests 55 pass; onnx suite 151 pass, 4 skipped. Five tests in `gen_ai_worker_close_test.dart` fail on Windows on the fork's main too (a Windows temp path is compared with its JSON-escaped form), so they are not from this PR; with that test line adjusted locally the suite is green. I will send that test fix separately.
- **`flutter build windows` of the example (x64): built.** It needed three machine-specific workarounds, none in repo files: a `nuget.exe` on PATH, a pub cache path without a space (flutter_scene's hook fails on `C:\Users\Samarthsinh Vala\...`), and `CL=/D_SILENCE_EXPERIMENTAL_COROUTINE_DEPRECATION_WARNINGS` for flutter_inappwebview_windows with the VS 2026 toolset. The ONNX DLLs in the output are `8664`.
- **ONNX generation smoke test on x64** (Phi-3.5-mini cpu-int4, DLLs from that build): both tests pass, 64 tokens at 10.9 tok/s (12.8 in a first run; CPU, i5-12450H).

So Windows x64 is unchanged by this PR. Nothing here ran on ARM64.

#### Not verified
- **Everything that needs Windows ARM64 hardware** (the same two checks passed above on x64): `flutter build windows` of `packages/flutter_edge_ai/example`, and the ONNX smoke tests (`onnx_generation_host_smoke_test.dart`, `onnx_embedding_host_smoke_test.dart`) with `FLUTTER_GEMMA_ORT_GENAI_LIBS`, `ONNX_SMOKE_GENAI_MODEL_DIR`, `FLUTTER_GEMMA_ORT_LIBRARY` and `ONNX_SMOKE_MINILM_DIR`. I have an x64 Windows PC only, and no ARM64 build or run, nor x64 under emulation, was done.
- The `Abi.windowsArm64` gate itself: `Abi.current()` cannot be faked on a non-ARM64 host, so no unit test covers that clause.
- `tool/test_all.sh` for the whole workspace (only the onnx and litertlm hook tests were run).
- The compatibility tables in the READMEs and `migration.md` ("core 2.3.0 · onnx 0.5.8 · …") are release-time and left for the release.





---


## 1D. Issues filed (beyond #517)

### Proposal: Out-of-Core / Streaming MoE Inference for Large Models on Memory-Constrained Devices *(issue)*
`#518` · **OPEN** · https://github.com/DenisovAV/flutter_edge_ai/issues/518

**Type:** feature proposal (research-first, opt-in, experimental)
**Scope:** a new optional engine package. No changes to existing engines or public APIs.

I'd like to work on this myself, starting with the measurement phase below. I'm opening this first to check whether it's in scope for the project and to agree on direction before writing code.

---

#### Problem

Every inference path today loads a model's weights as a whole inside an opaque native runtime:

- **LiteRT-LM (`.litertlm`)**
  - `LiteRtLmFfiClient.initialize` builds engine settings from a model *path* and calls `litert_lm_engine_create` once (`packages/flutter_gemma_litertlm/lib/src/ffi/litert_lm_client.dart`).
  - None of the bound C API functions (`litert_lm_bindings.dart`) control weight placement, memory budgets, per-layer or per-expert loading, or routing.
  - The decoder ships as a single `tf_lite_prefill_decode` TFLite section.
- **MediaPipe (`.task`)**: closed `LlmInference` behind pigeon.
- **ORT-GenAI (`flutter_gemma_onnx`)**: static graphs; MoE ops run over fully materialized expert tensors.

The practical ceiling is "whatever fits in device memory". The repo's own manifest fixtures already exclude models whose single section exceeds the ~2 GiB practical iOS mmap budget, and limit 7B models to desktop and 12 GB+ Android.

Meanwhile, many of the strongest open 20–35B models are **sparse Mixture-of-Experts** that use only ~3B parameters per token (Qwen3-30B-A3B, Qwen3.5/3.6-35B-A3B, gpt-oss-20b). Nothing in Flutter Gemma can exploit that sparsity.

#### Motivation

- **Quality:** 30–35B-class MoE models are much stronger than the 1–4B dense models phones run today, at similar per-token compute.
- **Privacy and offline:** keeping that capability on-device is Flutter Gemma's core value.
- **Hardware:** 2025+ flagships pair multi-GB/s NVMe/UFS 4 storage with 12–16 GB RAM, and storage is 10–20× larger than RAM. Treating storage as the weight tier fits that hardware.

#### Key idea

**35B parameters ≠ 35 GB of RAM.** Take Qwen3.6-35B-A3B at int4 (group 64): 40 layers, 256 experts per layer, each ≈ 1.69 MiB, and hybrid attention with only 10 full-attention layers.

| Component | Size |
|---|---|
| Whole checkpoint (on disk) | ≈ 18 GiB |
| Routed experts | ≈ 17.3 GiB of that |
| Dense (non-expert) weights | ≈ 1.32 GiB |
| KV cache | ≈ 20 KiB/token |
| Weights *touched* per token (8 experts × 40 layers + dense) | ≈ 1.85 GiB |
| Experts that must be resident at the same moment (layer-sequential execution: one layer's 8 experts) | ≈ 13.5 MiB |

Everything else can live on storage behind a bounded cache.

#### Proposed architecture

An **optional, experimental engine package** (working name `flutter_gemma_moe_stream`). It plugs into the existing `InferenceEngineProvider` registry (`canHandle` / `priority` / `createModel`) with no changes to existing engines.

```
FlutterGemma (core, unchanged)
  └─ StreamingMoeEngine (Dart, opt-in)      config validation, telemetry, lifecycle
       └─ native core (C++, shared iOS/Android)
            ├─ Scheduler: layer-sequential decode, expert-grouped prefill, exact routing
            ├─ Expert manager: byte-budgeted cache, refcount pins, pressure-aware shrink
            ├─ Prefetch planner: history + gate lookahead (drives loading only)
            ├─ IO layer: pread + F_NOCACHE / O_DIRECT (default) or mmap (opt-in)
            ├─ Model store: manifest + dense weights + per-layer page-aligned expert files + checksummed index
            ├─ Kernels: int4 gather-matmul (NEON/i8mm), hybrid attention, KV cache
            └─ Platform shim: IO flags, memory pressure, thermal, core affinity
```

Design choices:

- **Exact routing by default.** Prediction only schedules IO, so output matches the quantized base model. No hidden quality trade-offs.
- **Byte budget, not slot count.** A planner computes `floor = dense + KV(maxTokens) + state + activations + runtime`. If the budget can't cover that, it fails fast with a typed error.
- **`pread` over mmap by default on mobile.** Storage errors become error codes instead of SIGBUS, and memory accounting stays honest.
- **CPU first.** NPUs run AOT static graphs and can't page experts. GPU (e.g. Metal for dense attention) comes later.

#### API sketch (illustrative)

Engine-scoped and opt-in. Nothing is added to core `RuntimeConfig`, since other engines couldn't honour it.

```dart
await FlutterGemma.initialize(inferenceEngines: [
  StreamingMoeEngine(
    config: StreamingMoeConfig(
      maxResidentBytes: 4 << 30,
      storageMode: ExpertStorageMode.directRead, // or .mmap
      prefetch: ExpertPrefetch.predictive,       // .off / .history
      onBudgetInfeasible: BudgetPolicy.throwError,
    ),
  ),
]);
final model = await FlutterGemma.getActiveModel(maxTokens: 4096);
// Existing session APIs unchanged.
```

Also planned:

- a telemetry stream: resident bytes, cache bytes, hit rate, IO bytes/token, blocked-IO ms/token;
- typed exceptions.

Possible small core touch points (reviewed separately): a `ModelFileType` value, and resumable multi-file install with a free-space check for ~20 GB model directories.

#### Platform considerations

**iOS**
- Jetsam enforces `phys_footprint`, and clean file-backed pages are not counted. That helps, but it also makes memory easy to under-report.
- The `increased-memory-limit` and `extended-virtual-addressing` entitlements are already required.
- Read experts with `pread` + `F_NOCACHE` / `F_RDADVISE` rather than giant mappings.
- Drive the budget from `os_proc_available_memory()` and the memory-pressure source.
- Metal isn't available in background, so cancel or finish on CPU.

**Android**
- Storage speed varies ~10× across devices (eMMC/UFS 2.2 → UFS 4). Measure it on first run and warn or refuse below a threshold.
- lmkd reacts to PSI, and heavy file-cache churn can get *other* apps killed. Shrink the cache on `onTrimMemory`.
- Read with `O_DIRECT` + aligned buffers and `posix_fadvise`. File-based encryption sits on the read path.
- NNAPI/QNN/NeuroPilot are static graphs. GPU host-memory import is vendor-specific.

Both platforms share one native core behind a thin shim.

#### Memory model (estimates, to be measured)

```
M_anon ≈ dense weights (≈1.32 GiB)
       + expert cache C
       + KV(T)   (≈20 KiB/token hybrid 35B-A3B; ≈96 KiB/token full-attention 30B-A3B)
       + recurrent state (≈0.03–0.06 GiB)
       + activations + runtime + tokenizer (≈0.3 GiB in decode; more in prefill)
```

The floor (no cache) is ≈ 1.7 GiB at 512 tokens and ≈ 2.0 GiB at 16K. The expert cache is the speed knob.

**Honest reporting.** Every benchmark row states:

1. peak anonymous footprint (iOS `phys_footprint`; Android `Private_Dirty + SwapPss` + GPU);
2. peak resident model-file pages;
3. available RAM at test time.

Peaks span load, prefill and decode.

#### Performance trade-offs (estimates, to be validated)

| Aspect | Expectation |
|---|---|
| RAM | 18 GiB checkpoint → ~3–4 GiB anonymous footprint for hybrid 35B-A3B; less favourable for full-attention or coarse-expert MoE |
| Decode | ~4–8 tok/s on flagships at 3–4 GiB; ~1–2 tok/s on mid-range storage |
| Prefill / TTFT | **The main cost.** Any prompt over ~100 tokens touches nearly every expert, so a cold prompt reads ~17 GiB once: ~10–20 s on flagship storage plus prefill compute. Prompt-prefix KV reuse helps multi-turn chat. |
| Cold start | Dense weights (~1.3 GiB) load in seconds; experts load lazily |
| Battery / thermal | Sustained high-throughput reads plus full CPU load; must be measured over 10-minute runs |
| Quality | Identical to the quantized base with exact routing |

**Target I'd propose committing to:**

- ≤ 4 GiB anonymous footprint at 4K context;
- ≥ 5 tok/s decode;
- ≤ 20 s cold TTFT for a 256-token prompt;
- on a 2025+ flagship;
- file-backed memory always reported.

~3 GiB may be reachable for hybrid A3B models at short context, but only as a stretch goal.

#### Compatibility

- Fully opt-in: a new package registered via `FlutterGemma.initialize(inferenceEngines: [...])`.
- Existing engines, model files and session APIs are unchanged, and current users get no new dependencies.
- Existing `.litertlm` / `.task` / ONNX models would not gain this. That would need upstream LiteRT-LM support for expert-addressable sections, which could be raised later with data.

#### Implementation plan (gated)

| Phase | Deliverable |
|---|---|
| 0 | **Evidence, no product code:** routing-trace cache simulator; mobile expert-block IO microbenchmark; honest memory telemetry for existing engines. **Go/no-go.** |
| 1 | Baseline with an existing mmap-capable open runtime, to learn what the OS page cache gives for free |
| 2 | Native streaming-expert executor (CLI first): format + index, byte-budget cache, `pread` IO, exact routing, int4 kernels, parity tests |
| 3 | Async IO + history / gate-lookahead prefetch |
| 4 | Expert-grouped prefill + prompt-prefix KV reuse |
| 5 | Experimental Flutter package: provider, native-assets hook, config, telemetry, typed errors |
| 6 | iOS/Android tuning: memory pressure, thermal, affinity, storage probe |
| 7 | Full benchmark matrix → keep experimental / promote / upstream proposal / stop |

#### Benchmark plan and acceptance

**Arms:**

1. current Flutter Gemma (`.litertlm`) on the largest dense models;
2. an existing mmap-based runtime;
3. the new engine in `directRead` mode;
4. the new engine in `mmap` mode.

**Test matrix:**

- **Models:** Gemma 4 E2B/E4B, a 7–8B dense model, Gemma 3 12B where it fits, gpt-oss-20b, Qwen3-30B-A3B, Qwen3.6-35B-A3B.
- **Contexts:** 512 / 2K / 4K / 8K / 16K.
- **Devices:** iPhone Pro, Snapdragon 8 Elite-class, Pixel (Tensor), UFS 3.1 mid-range, UFS 2.2 low-end.

**Acceptance gates:**

| Gate | Criterion |
|---|---|
| G1 | ≥ 99% top-1 agreement vs reference over 1k greedy tokens |
| G2 | ≤ 4 GiB peak anonymous footprint @4K (35B-A3B), file-backed memory reported |
| G3 | ≥ 5 tok/s decode on flagship, and ≥ 2× the page-cache baseline at equal total memory |
| G4 | ≤ 20 s cold TTFT for a 256-token prompt on flagship |
| G5 | 10-minute sustained run: no kill, ≥ 60% of initial tok/s |
| G6 | No crashes under fault injection: truncated or corrupt files, pressure signals, backgrounding, cancel mid-read |

#### Open questions for maintainers

1. Is an experimental package with its own native runtime acceptable, given the CI and prebuilt cost across Android/iOS?
2. Build the executor from scratch, or on an existing runtime's kernels/format (e.g. ggml/GGUF)? Any licence constraints?
3. Which MoE families should be first-class? Is there a Gemma-family MoE in a redistributable format to prioritise?
4. Model format: GGUF/safetensors plus a sidecar index, or a new manifest with per-layer expert files?
5. Is a ~20 GB model download acceptable UX, and should core support resumable multi-file directory installs?
6. Should the engine refuse to run below a measured storage-throughput threshold?
7. Any appetite to raise expert-addressable sections with the LiteRT-LM team once there's data?

#### Next step I'm proposing

If this direction is welcome, I'll start with **Phase 0**, which touches no production code:

- the routing-trace cache simulator;
- the mobile IO microbenchmark;
- the memory telemetry.

I'll post the measured numbers here before any engine work.



---

### diagnostics: Linux and Windows, plan for the first piece (follows #517) *(issue)*
`#698` · **OPEN** · https://github.com/DenisovAV/flutter_edge_ai/issues/698

**Plan only, no code until we agree.** You suggested one piece at a time, so this proposes Linux first and sketches Windows after.

##### Piece 1: Linux desktop `memorySnapshot()`

Why first: the Android reader already parses the same files, and the existing real-`/proc` tests run on a Linux host.

| field | what is read | null when |
|---|---|---|
| `anonymousBytes` | `smaps_rollup` `Private_Dirty + SwapPss` | the kernel has no `smaps_rollup` (before 4.14; a documented gap, as on Android) |
| `fileBackedBytes` | `smaps_rollup` `Private_Clean + Shared_Clean` | same |
| `availableBytes` | `/proc/meminfo` `MemAvailable`, whole machine | never null; documented as an upper bound, like Android |
| `anonymousPeakBytes` | not read | always null: the kernel keeps no anonymous-only peak (`VmHWM` counts file pages) |

Measured on a Linux 7.0 host: the files and fields are the ones Android uses, and `memory.max` of a desktop session is `max`.

Open question 1: in a container or a systemd scope with `memory.max` set, the limit is the cgroup's, not `MemAvailable`. Should `availableBytes` stay machine-wide (simple, same as Android) or become `memory.max - memory.current` when a limit is set? I would start machine-wide and say so.

What changes: `isSupported` and `memorySnapshot()` accept Linux; the Android reader moves from `android/` to a shared `proc/` file (no behaviour change there); README, site, skill and the null list say Linux. No new public type.

##### Piece 2 (to measure first): Windows

- `anonymousBytes`: `PROCESS_MEMORY_COUNTERS_EX2.PrivateWorkingSetSize` (resident private pages), through `dart:ffi` to `psapi`/`kernel32`; `fileBackedBytes`: `WorkingSetSize - PrivateWorkingSetSize` (this includes shareable DLL pages, so it is not "model weights"); `availableBytes`: `GlobalMemoryStatusEx` `ullAvailPhys`, machine-wide.
- `anonymousPeakBytes`: `PeakPagefileUsage` is a peak of commit, not resident memory, so I would leave it null rather than present a number of a different kind.
- I have not run any of this yet: my PC dual-boots Windows, so the numbers would come from a measured run before the plan is final.

##### GPU beyond Adreno (later, separate question)

- Linux: DRM fdinfo (`drm-total-*` / `drm-resident-*`, one client per open fd, dedupe by `drm-client-id`). On my host i915 reports it and the NVIDIA proprietary driver reports nothing, so a reading would be null there.
- Windows: DXGI `QueryVideoMemoryInfo` `CurrentUsage` is per process; it needs COM through FFI, so it is the heavier piece.
- Apple: `ledger_tag_graphics_footprint` (offset 272 of the `TASK_VM_INFO` reply we already read) and `MTLDevice.currentAllocatedSize`.
- Shape question: today's `GpuMemoryReading` says which snapshot bucket each number overlaps (dirty/clean pages of a mapping). VRAM is not in the process's pages, so DRM and DXGI numbers do not fit those two fields. A new field (for example device-resident bytes) or a different type? I would not touch the type before you say.

What I would do next if you agree with piece 1: implement it in one PR (reader move + Linux gate + tests that run on a Linux CI host + docs), and measure Windows on my machine for the plan of piece 2.



---

### Qwen3-0.6B.litertlm fails to load on Android after 2.3 / litertlm 1.13 (Failed to create engine); works on flutter_gemma 1.8.3 *(issue)*
`#659` · **CLOSED** · https://github.com/DenisovAV/flutter_edge_ai/issues/659

#### Summary
After upgrading from `flutter_gemma` 1.8.3 / `flutter_gemma_litertlm` 1.6.3 to `flutter_edge_ai` 2.3.2 / `flutter_edge_ai_litertlm` 1.13.2, `litert-community/Qwen3-0.6B` (`Qwen3-0.6B.litertlm`) no longer loads on Android. The identical file loads and answers on the old packages on the same phone. `gemma-4-E2B-it.litertlm` is unaffected.

#### Error
```
BackendInitException: all FFI backends failed. Last attempted cpu. Attempts:
  gpu: Exception: Failed to create engine. Model may be invalid: .../app_flutter/Qwen3-0.6B.litertlm;
  cpu: Exception: Failed to create engine. Model may be invalid: .../app_flutter/Qwen3-0.6B.litertlm
#0 LiteRtLmFfiClient.initialize (flutter_edge_ai_litertlm/src/ffi/litert_lm_client.dart:956)
#1 LiteRtLmEngine.createModel (litert_lm_engine.dart:167)
```
Just before it: `[LiteRtLmFfi] litert_lm_engine_create took 91ms`, then `[LiteRtLmEngine] cpu backend failed, no candidates are left`.

#### Environment
- Device: vivo 1933, Android 11 (API 30), arm64
- New: `flutter_edge_ai` 2.3.2, `flutter_edge_ai_litertlm` 1.13.2, native bundle `native-v0.18.0-e` (checksum verified on download)
- Old (works): `flutter_gemma` 1.8.3, `flutter_gemma_litertlm` 1.6.3, native `native-v0.16.0`
- Model: https://huggingface.co/litert-community/Qwen3-0.6B/resolve/main/Qwen3-0.6B.litertlm, 614,236,160 bytes, installed with `FlutterEdgeAi.installModel(modelType: ModelType.qwen3, fileType: ModelFileType.litertlm).fromFile(...)`
- Load call: `FlutterEdgeAi.getActiveModel(maxTokens: 256)`, then `openChat(temperature: 0.2, topK: 20)`

#### What I checked
| | Result |
|---|---|
| Old packages, same device, same file | loads, answers |
| New packages, same file | `Failed to create engine. Model may be invalid` on GPU and CPU |
| File on device vs source file | same size (614,236,160 bytes) |
| Gemma 4 E2B on the new packages | loads, stop/restart works, no memory growth over 6 chats |

So it does not look like a truncated download, a bad install, or a GPU-only problem. It reads like the 0.18 engine rejecting this particular bundle (the failure is at engine create, 91 ms in).

#### Expected
The model that loaded under LiteRT-LM 0.16 keeps loading, or the upgrade notes say Qwen3 0.6B needs a re-converted bundle.

#### Notes / what would help
- Is `litert-community/Qwen3-0.6B` still supported by `native-v0.18.0-e`, or does it need a newer bundle?
- Is there a way to get the underlying engine error text instead of the generic "Model may be invalid"?

#### Happy to help
We ship this model in a production app and would like to see it fixed. I can test any fix or branch on a physical device, run a bisect across the native bundles (0.16.0 / 0.17.x / 0.18.0-a..e) to find the first one that rejects the file, and open a PR if you point me at the right place.



---

### litertlm: LiteRtLmConversationHandle doc contradicts the one-live-conversation limit (#966) *(issue)*
`#516` · **CLOSED** · https://github.com/DenisovAV/flutter_edge_ai/issues/516

#### Summary

`packages/flutter_gemma_litertlm/lib/src/ffi/litert_lm_client.dart` has doc comments that disagree about how many live conversations the LiteRT-LM engine supports.

**Claims multiple conversations per engine** (`LiteRtLmConversationHandle` doc, ~lines 100–108):

> This is what makes concurrent sessions possible — the LiteRT-LM C API supports multiple `LiteRtLmConversation*` per engine; the handle owns one and routes every per-conversation native call through the client's private `_…On(conv, …)` methods.

**Claims exactly one live conversation** (~lines 912–916, `createConversationHandle`):

> The engine allows only ONE live conversation at a time (upstream LiteRT-LM #966), so the caller must delete any prior conversation before creating a new one — this is how virtual-session multiplexing rebuilds context.

The same one-conversation constraint is repeated at ~lines 1318–1322 (`_virtualConv`) and ~line 940.

#### Why it matters

The virtual-session multiplexer (tear down and rebuild the conversation per turn, replaying history) exists *because* of the one-conversation limit. A reader who trusts the handle doc could "simplify" it into real concurrent native conversations. That is the failure #966 describes.

#### Suggested fix

Update the `LiteRtLmConversationHandle` doc to match the current constraint. For example: handles are per-conversation for ownership and lifetime, but only one may be live per engine today (upstream #966), and concurrency is provided by virtual-session multiplexing. Remove or qualify the "supports multiple `LiteRtLmConversation*` per engine" sentence until upstream lifts the limit.

Comment-only change; no behaviour change. Happy to send a PR.



---


---
---

# 2. webpack — Contributor

**Repo:** https://github.com/webpack/webpack · The core JavaScript module bundler.
**At a glance:** 6 merged PRs · 1 open — runtime correctness, diagnostics, stats output,
and build-performance.

### docs: fix typo in CONTRIBUTING.md link text
`#20219` · **MERGED** · +1/−1 · https://github.com/webpack/webpack/pull/20219

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. -->

**Summary**

This PR fixes a small typo in [CONTRIBUTING.md](cci:7://file:///c:/Users/Samarthsinh/Desktop/Work/contri/webpack/CONTRIBUTING.md:0:0-0:0).

The markdown link text for the “Send a PR” label previously contained an extra closing parenthesis:

- Before: `[Send a PR)](...)`
- After: `[Send a PR](...)`

The link target remains the same; only the link text is corrected to improve readability for contributors.

**What kind of change does this PR introduce?**

- [x] Documentation update
- [ ] Bugfix
- [ ] New feature
- [ ] Refactoring
- [ ] Build-related change
- [ ] Other

**Did you add tests for your changes?**

- [ ] Yes
- [x] No – this PR only updates documentation (CONTRIBUTING.md) and does not touch runtime code.

**Does this PR introduce a breaking change?**

- [x] No
- [ ] Yes (please describe below)

<!-- If this PR introduces a breaking change, please describe the impact and a migration path for existing applications. -->

**If relevant, what needs to be documented once your changes are merged or what have you already documented?**

This PR only fixes a typo in [CONTRIBUTING.md](cci:7://file:///c:/Users/Samarthsinh/Desktop/Work/contri/webpack/CONTRIBUTING.md:0:0-0:0); no additional documentation changes are required.


---

### fix: replace Cyrillic character with Latin in comment
`#20220` · **MERGED** · +1/−1 · https://github.com/webpack/webpack/pull/20220

**Summary**

This PR fixes a typo in [lib/WebpackOptionsApply.js](cci:7://file:///c:/Users/Samarthsinh/Desktop/Work/contri/webpack/lib/WebpackOptionsApply.js:0:0-0:0) where a Cyrillic character "ш" (sha, U+0448) was accidentally used instead of the Latin letter "i" in the word "it".

**Location:** Line 114 in [lib/WebpackOptionsApply.js](cci:7://file:///c:/Users/Samarthsinh/Desktop/Work/contri/webpack/lib/WebpackOptionsApply.js:0:0-0:0)

- **Before:** `// but шt seems like there shouldn't be a warning here...`
- **After:** `// but it seems like there shouldn't be a warning here...`

This is a code quality fix that:
- Improves searchability (grep/find won't work with mixed character encodings)
- Ensures consistent ASCII encoding in the codebase
- Removes potential encoding-related issues in some editors/tools

**What kind of change does this PR introduce?**

- [x] Code quality fix (typo in source file)
- [ ] Bugfix
- [ ] New feature
- [ ] Refactoring
- [ ] Build-related change

**Did you add tests for your changes?**

- [ ] Yes
- [x] No – this is a comment-only change that doesn't affect runtime behavior

**Does this PR introduce a breaking change?**

- [x] No
- [ ] Yes

**If relevant, what needs to be documented once your changes are merged?**

No documentation changes needed.


---

### fix: add null check for module existence with helpful error message
`#20221` · **MERGED** · +115/−0 · https://github.com/webpack/webpack/pull/20221

Adds a check before module execution to provide a helpful error message when a module ID is not found in `__webpack_modules__`, instead of the cryptic `Cannot read properties of undefined (reading 'call')` error.

Fixes #18021

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. -->

**Summary**

When a module ID is missing from `__webpack_modules__`, the webpack runtime currently tries to execute it and crashes with:

`TypeError: Cannot read properties of undefined (reading 'call')`

This error originates from the generated runtime in [JavascriptModulesPlugin](cci:2://file:///c:/Users/Samarthsinh/Desktop/Work/contri/webpack/lib/javascript/JavascriptModulesPlugin.js:228:0-1822:1) and does not clearly tell users that the actual problem is a missing/unloaded module.

This PR adds a defensive check before executing the module factory:

- If `__webpack_modules__[moduleId]` is `undefined`, we now throw a descriptive `Error` explaining that the module with the given ID cannot be found and may not be loaded or was removed.
- This turns a low-level TypeError into a clear, actionable error message, improving the UX when module loading goes wrong (e.g. dynamic imports, federation, or other advanced setups).

**What kind of change does this PR introduce?**

- [x] Bugfix / UX improvement (better runtime error handling)
- [ ] New feature
- [ ] Refactoring
- [ ] Build related change
- [ ] Other

**Did you add tests for your changes?**

- [ ] Yes
- [x] No

This change is a small defensive check inside the runtime path and is mainly focused on improving the error message, not changing the control flow. The existing runtime/missing-module tests already cover the behavior that an `Error` is thrown when a module is missing; this PR only makes the message clearer.

I am happy to add a dedicated test if maintainers can suggest the preferred place and pattern (e.g. extending [test/cases/runtime/error-handling](cci:7://file:///c:/Users/Samarthsinh/Desktop/Work/contri/webpack/test/cases/runtime/error-handling:0:0-0:0) or one of the `missing-module-*` runtime cases) to assert the new message.

**Does this PR introduce a breaking change?**

- [x] No
- [ ] Yes

<!-- If this PR introduces a breaking change, please describe the impact and a migration path for existing applications. -->

The behavior (throwing an error when a module is missing) stays the same; only the error message becomes more descriptive.

**If relevant, what needs to be documented once your changes are merged or what have you already documented?**

No documentation updates are required. This change only improves the runtime error message surfaced to users when a module cannot be found.


---

### feat: optimize regex character class with ranges in compileBooleanMat…
`#20229` · **MERGED** · +116/−10 · https://github.com/webpack/webpack/pull/20229

**Summary**

This PR implements the TODO in `lib/util/compileBooleanMatcher.js` to further optimize the regular expressions generated by `compileBooleanMatcher.itemsToRegexp`.

Previously, when there were multiple single-character alternatives, the generated character classes simply listed all characters individually, for example:

- `(1|2|3|4|a)` → `[1234a]`

This PR enhances that behavior by detecting consecutive characters and converting them into more compact ranges inside the character class, while preserving the same matching semantics. For example:

- `(1|2|3|4|a)` → `[1-4a]`
- `(a|b|c|d|e)` → `[a-e]`
- `(1|2|3|a|b|c|x|y|z)` → `[1-3a-cx-z]`

This makes the generated regular expressions shorter and potentially faster to evaluate, especially when dealing with many single-character alternatives.

---

**What kind of change does this PR introduce?**

Feature / optimization.

It improves the internal regex generation logic used by `compileBooleanMatcher` without changing the external API.

---

**Did you add tests for your changes?**

Yes.

I updated and extended `test/compileBooleanMatcher.unittest.js`:

- Updated existing expectations to account for range-based character classes (e.g. `[1-3a-c]` instead of `[123abc]`).
- Added new test cases that explicitly cover:
  - single characters with ranges
  - multiple disjoint ranges
  - mixed ranges and single characters
  - behavior with gaps

All tests in `test/compileBooleanMatcher.unittest.js` pass.

---

**Does this PR introduce a breaking change?**

No.

The change only affects how the regular expressions are represented internally (more compact character classes). The set of matched strings remains the same. There is no change to the public API of webpack or to configuration options.

---

**If relevant, what needs to be documented once your changes are merged or what have you already documented?**

No user-facing documentation changes are required.

This is an internal optimization of `compileBooleanMatcher`, and it should be fully covered by the added unit tests. If desired, a short note could be added to the changelog mentioning that regex generation for boolean matchers was optimized to use character class ranges.


---

### fix: process async entries with forceSideEffects in global mode (#18315)
`#20251` · **MERGED** · +53/−6 · https://github.com/webpack/webpack/pull/20251

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. -->

**Summary**

Fixes #18315.

When `optimization.usedExports` is set to `"global"`, async entry blocks (e.g. web workers created via `new Worker(new URL(...))`) were not processed with `forceSideEffects: true` during export usage analysis.

In that mode, CommonJS modules that contain self-reference dependencies (handled by `CommonJsSelfReferenceDependency`) could end up with exports not being marked as used, which then triggers:

`Error: Self-reference dependency has unused export name: This should not happen`

This change ensures that async entries are always analyzed with `forceSideEffects: true`. When the analysis runs in global mode, the async entry is analyzed using `runtime: undefined` (global runtime), aligning it with the rest of the global used-exports analysis.

**What kind of change does this PR introduce?**

fix

**Did you add tests for your changes?**

Yes. Added a regression test case:

- `test/configCases/worker/worker-self-reference-global/`

It reproduces the failure by importing a CommonJS module with a self-reference dependency from within a worker when `optimization.usedExports: "global"` is enabled.

**Does this PR introduce a breaking change?**

No.

**If relevant, what needs to be documented once your changes are merged or what have you already documented?**

No documentation changes.


---

### fix: respect errorStack option in stats output (#15980)
`#20258` · **MERGED** · +74/−2 · https://github.com/webpack/webpack/pull/20258

**Summary**

Fixes #15980.

The `errorStack` extractor was not checking the `errorStack` option before adding stack traces to error output. This caused stack traces to be printed even when `stats.errorStack` was set to `false`.

This fix adds a check for the `errorStack` option, similar to how `errorDetails` checks its corresponding option.

**What kind of change does this PR introduce?**

fix

**Did you add tests for your changes?**

Yes. Added a regression test case:

- `test/statsCases/error-stack-disabled-error/`

It verifies that when `stats.errorStack: false` is set, error stack traces are not included in the stats output.

**Does this PR introduce a breaking change?**

No.

**If relevant, what needs to be documented once your changes are merged or what have you already documented?**

No documentation changes.


---

### feat: expose importAttributes to loaders via _importAttributes
`#20232` · **OPEN** · +56/−3 · https://github.com/webpack/webpack/pull/20232


**Summary**

This PR exposes `importAttributes` to the loader interface so loaders can react to metadata on `import`/`import()` statements, as requested in [#20228](https://github.com/webpack/webpack/issues/20228).

Today, the parser already understands import attributes, and they are used for things like rule matching, but loaders cannot see them. This change threads the parsed `ImportAttributes` from the dependency/resolve data into [NormalModule](cci:2://file:///c:/Users/Samarthsinh/Desktop/Work/contri/webpack/lib/NormalModule.js:269:0-1771:1) and then into the loader context as `_importAttributes`, so loaders can read them via `this._importAttributes`.

High-level implementation:

- Extend [NormalModuleFactory](cci:2://file:///c:/Users/Samarthsinh/Desktop/Work/contri/webpack/lib/NormalModuleFactory.js:338:0-1437:1) to include `importAttributes` in the `createData` passed to [NormalModule](cci:2://file:///c:/Users/Samarthsinh/Desktop/Work/contri/webpack/lib/NormalModule.js:269:0-1771:1).
- Store `importAttributes` on [NormalModule](cci:2://file:///c:/Users/Samarthsinh/Desktop/Work/contri/webpack/lib/NormalModule.js:269:0-1771:1) instances.
- Expose the stored attributes on the loader context as `_importAttributes`, following the pattern of other internal context fields like `_module`, `_compilation`, etc.
- Update [declarations/LoaderContext.d.ts](cci:7://file:///c:/Users/Samarthsinh/Desktop/Work/contri/webpack/declarations/LoaderContext.d.ts:0:0-0:0) to include `_importAttributes?: Record<string, unknown>`.
- Add a `configCases` test case under `test/configCases/loaders/import-attributes-loader-context`:
  - A custom loader reads `this._importAttributes` and exports it.
  - One import with attributes and one without, asserting:
    - Attributes object is passed through when present.
    - `undefined` is produced when no attributes are present.

**What kind of change does this PR introduce?**

Feature.

It adds a new capability for loaders to inspect the import attributes of the module they are processing (via `_importAttributes` on the loader context).

**Did you add tests for your changes?**

Yes.

- Added a new config test:
  - [test/configCases/loaders/import-attributes-loader-context/webpack.config.js](cci:7://file:///c:/Users/Samarthsinh/Desktop/Work/contri/webpack/test/configCases/loaders/import-attributes-loader-context/webpack.config.js:0:0-0:0)
  - [test/configCases/loaders/import-attributes-loader-context/loader.js](cci:7://file:///c:/Users/Samarthsinh/Desktop/Work/contri/webpack/test/configCases/loaders/import-attributes-loader-context/loader.js:0:0-0:0)
  - [test/configCases/loaders/import-attributes-loader-context/index.js](cci:7://file:///c:/Users/Samarthsinh/Desktop/Work/contri/webpack/test/configCases/loaders/import-attributes-loader-context/index.js:0:0-0:0)
- Ran targeted Jest tests for this case:
  - `node node_modules/jest/bin/jest.js test/ConfigTestCases.basictest.js --no-coverage --runInBand --testNamePattern=import-attributes-loader-context`
- Also ran loader/import-attributes related config tests via `--testNamePattern="loaders import-attributes"` to ensure existing cases still pass.

On my Windows environment, running the full Jest suite surfaces unrelated snapshot differences (absolute paths vs `<cwd>`) and missing optional dependencies like `@swc/core` / `esbuild`, which appear to be environment-specific and not related to this change.

**Does this PR introduce a breaking change?**

No.

- The change only adds a new internal property `_importAttributes` on the loader context.
- Existing loaders and configurations continue to work as before.
- No existing public APIs are removed or changed.

**If relevant, what needs to be documented once your changes are merged or what have you already documented?**

- Loader API docs should mention that the loader context now provides `_importAttributes` (an object of import attributes when present, otherwise `undefined`) for modules that were imported with attributes.
- It may be worth adding:
  - A short example of a loader that branches behavior based on `_importAttributes` (e.g., treating assets differently when `with { type: "image", preload: true }` is used).
  - A note that this is populated only when the module is reached via an import with attributes and is otherwise `undefined`.


---


---
---

# 3. Backstage (CNCF) — Contributor

**Repo:** https://github.com/backstage/backstage · CNCF developer-portal platform.
**At a glance:** 4 merged PRs — core-components and catalog UI correctness.

### fix(catalog): add vertical spacing between tags in catalog table
`#32376` · **MERGED** · +6/−1 · https://github.com/backstage/backstage/pull/32376

#### Hey, I just made a Pull Request!

##### Description
Fixed vertical spacing between tags in the catalog table component list. Tags previously had `marginBottom: '0px'` which caused borders to overlap when tags wrapped to multiple lines.

**Change**: Updated `margin: '2px'` on Chip components in [plugins/catalog/src/components/CatalogTable/columns.tsx](cci:7://file:///c:/Users/Samarthsinh/Desktop/Work/contri/backstage/plugins/catalog/src/components/CatalogTable/columns.tsx:0:0-0:0) to provide consistent spacing around each tag.

Fixes #31229

###### :heavy_check_mark: Checklist

- [x] A changeset describing the change and affected packages. ([more info](https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md#creating-changesets))
- [ ] Added or updated documentation
- [x] Tests for new functionality and regression tests for bug fixes
- [ ] Screenshots attached (for UI changes)
- [x] All your commits have a `Signed-off-by` line in the message. ([more info](https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md#developer-certificate-of-origin))


---

### fix(core-components): fix Table layout when filters and title are used together
`#32377` · **MERGED** · +29/−3 · https://github.com/backstage/backstage/pull/32377

#### Hey, I just made a Pull Request!

##### Description
Fixed Table component layout when both `filters` and `title` props are used together. The [TableToolbar](cci:1://file:///c:/Users/Samarthsinh/Desktop/Work/contri/backstage/packages/core-components/src/components/Table/Table.tsx:294:0-346:1) was incorrectly using the same CSS class (`filtersClasses.root`) for both the outer container and the nested filter controls, causing layout conflicts.

**Changes**:
- Added dedicated `filterControls` CSS class for the filter icon/text container
- Added `flex-wrap: wrap` to root container for better responsiveness
- Fixed the nested Box using the same class issue

Fixes #32120

###### :heavy_check_mark: Checklist

- [x] A changeset describing the change and affected packages. ([more info](https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md#creating-changesets))
- [ ] Added or updated documentation
- [x] Tests for new functionality and regression tests for bug fixes
- [ ] Screenshots attached (for UI changes)
- [x] All your commits have a `Signed-off-by` line in the message. ([more info](https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md#developer-certificate-of-origin))


---

### fix(ui): Fix nested Accordion icon state issue
`#32488` · **MERGED** · +9/−2 · https://github.com/backstage/backstage/pull/32488

#### Hey, I just made a Pull Request!

<!-- Please describe what you added, and add a screenshot if possible.
     That makes it easier to understand the change so we can :shipit: faster. -->

This PR fixes issue #32384 where nested Accordion components incorrectly display their arrow icons.

**Problem:**
When using nested `<Accordion>` components, clicking the outer accordion to expand it would also cause the inner (collapsed) accordion's arrow icon to rotate to the "expanded" position, even though the inner accordion was still collapsed.

**Root Cause:**
The CSS selector in `Accordion.module.css` was using `[data-expanded='true'] &` which matches **any ancestor** with the `data-expanded='true'` attribute. This caused the inner accordion's icon to inherit the expanded state from its parent accordion.

**Solution:**
Changed the CSS selector to use a direct parent relationship:
```css
.bui-AccordionTriggerButton[data-expanded='true'] > & {
  transform: rotate(180deg);
}
```

This ensures the icon only rotates when its **immediate parent button** has `data-expanded='true'`.

###### :heavy_check_mark: Checklist

<!--- Please include the following in your Pull Request when applicable: -->

- [x] A changeset describing the change and affected packages. ([more info](https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md#creating-changesets))
- [ ] Added or updated documentation
- [x] Tests for new functionality and regression tests for bug fixes
- [ ] Screenshots attached (for UI changes)
- [x] All your commits have a `Signed-off-by` line in the message. ([more info](https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md#developer-certificate-of-origin))

Fixes #32384



---

### feat(core-components): Migrate CopyTextButton from MUI to BUI
`#32855` · **MERGED** · +43/−24 · https://github.com/backstage/backstage/pull/32855

#### Pull Request: Migrate CopyTextButton Component from MUI to BUI

#### Description

Migrated the **CopyTextButton** component from Material-UI (MUI) to Backstage UI (BUI) as part of the ongoing MUI to BUI migration effort ([Issue #31467](https://github.com/backstage/backstage/issues/31467)).

##### Changes Made

- **Replaced MUI IconButton** → BUI ButtonIcon from `@backstage/ui`
- **Replaced MUI Tooltip** → BUI TooltipTrigger + Tooltip components
- **Updated component logic** to use BUI's tooltip API with `isOpen` and `onOpenChange` props
- **Updated tests** to work with BUI component structure
- **Added @backstage/ui dependency** to core-components package.json
- **Created changeset** for release notes
- **Maintained backward compatibility** - Component API remains unchanged

##### Key Implementation Details

**Before (MUI):**
```tsx
<Tooltip
  title={tooltipText}
  placement="top"
  leaveDelay={tooltipDelay}
  onClose={() => setOpen(false)}
  open={open}
>
  <IconButton onClick={handleCopyClick} aria-label={ariaLabel}>
    <CopyIcon />
  </IconButton>
</Tooltip>
```

**After (BUI):**
```tsx
<TooltipTrigger isOpen={open} onOpenChange={setOpen}>
  <ButtonIcon
    icon={<CopyIcon />}
    onPress={handleCopyClick}
    aria-label={ariaLabel}
  />
  <Tooltip>{tooltipText}</Tooltip>
</TooltipTrigger>
```

##### Affected Files

- `packages/core-components/src/components/CopyTextButton/CopyTextButton.tsx` - Component implementation
- `packages/core-components/src/components/CopyTextButton/CopyTextButton.test.tsx` - Updated tests
- `packages/core-components/package.json` - Added @backstage/ui dependency
- `.changeset/migrate-copytextbutton-mui-to-bui.md` - Changeset file

#### :heavy_check_mark: Checklist

- [x] A changeset describing the change and affected packages. ([more info](https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md#creating-changesets))
- [x] All tests updated and passing
- [x] No breaking changes - backward compatible
- [x] Pre-commit hooks passed
- [ ] Screenshots (N/A - Internal refactoring)
- [ ] All commits have a `Signed-off-by` line (will add on merge if needed)

#### Testing

- Updated existing tests to work with BUI component structure
- Component maintains same visual feedback:
  - Hover color via BUI ButtonIcon styling
  - Tooltip shown after click with configurable delay
  - Copy to clipboard functionality preserved

#### Migration Pattern

This migration follows the same pattern as other MUI to BUI migrations:

1. **Replace component imports** - Swap MUI components for BUI equivalents
2. **Update props/API** - Adapt to BUI component API (e.g., `onPress` instead of `onClick`)
3. **Update styling** - BUI uses CSS modules and design tokens instead of makeStyles
4. **Update tests** - Adjust tests to work with BUI component structure
5. **Add dependencies** - Include @backstage/ui in package.json
6. **Create changeset** - Document the change for release notes

#### Related Issue

Contributes to [#31467](https://github.com/backstage/backstage/issues/31467) - MUI to BUI Migration

---

**Component Details:**
- **File:** `packages/core-components/src/components/CopyTextButton/CopyTextButton.tsx`
- **Lines:** 122
- **Complexity:** Low
- **Risk:** Low (internal refactoring with no API changes)
- **Testing:** All tests updated




---


---
---

# 4. C2SI · Webiu — Contributor

**Repo:** https://github.com/c2siorg/Webiu · Open-source website platform for the C2SI org.
**At a glance:** 6 merged PRs — UI, API versioning, error handling, data fetching, and
backend test reliability.

### fix(ui): add default search UI to contributor search page
`#339` · **MERGED** · +144/−2 · https://github.com/c2siorg/Webiu/pull/339

#### Pull Request Descriptions

---

#### PR  fix/contributor-search-default-state (Closes #276)

---

When navigating directly to `/search` without a `?username=` query parameter, the page rendered completely blank — no input, no guidance.

Add a centered hero section with a username input and search button that is shown whenever no profile has been loaded. Error messages (e.g. username not found) are now also displayed inline within the hero so users can retry without navigating away.

Closes #276

#### Description

The Contributor Search page (`/search`) relied entirely on a `?username=` query parameter being present (set when navigating from the Contributors page). When a user visited the URL directly or shared it without a username, the page showed only the navbar with a completely empty body — no input field, no call-to-action, no hint that the page is interactive.

**Changes made:**

- Added a centered search hero section in `contributor-search.component.html` that renders whenever no profile has been loaded (`!loading && !userProfile`). It includes:
  - A search icon
  - A title and descriptive subtitle
  - A username `<input>` bound via `[(ngModel)]` supporting Enter-key submission
  - A Search button (disabled when input is empty)
  - Inline error message so the user can retry without navigating away
- Added corresponding styles in `contributor-search.component.scss` for the hero, input group, search button, and error text, all using existing CSS custom properties so dark mode works automatically.

**Files changed:**

- `webiu-ui/src/app/page/contributor-search/contributor-search.component.html`
- `webiu-ui/src/app/page/contributor-search/contributor-search.component.scss`

Fixes #276

#### Type of change

- [x] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] This change requires a documentation update

#### UI Before / After

##### Before
<img width="1916" height="996" alt="image" src="https://github.com/user-attachments/assets/ec60e7b6-18fb-442e-9294-b95ae6c9f6f4" />

##### After
<img width="1916" height="996" alt="image" src="https://github.com/user-attachments/assets/19cab0fc-74b0-4c73-ac28-474d14f46cab" />

#### How Has This Been Tested?

- Navigated directly to `http://localhost:4200/search` — hero section renders correctly with input and button.
- Searched for a valid GitHub username — profile and contributions load as expected.
- Searched for an invalid/non-existent username — error message appears inline in the hero without navigating away; user can correct and retry.
- Verified dark mode — hero uses CSS custom properties, no hardcoded colours; looks correct in both themes.
- Confirmed that navigating from the Contributors page with `?username=` still auto-triggers the search (existing behaviour unchanged).

- [x] Direct navigation to `/search` — hero shown
- [x] Search with valid username — results shown
- [x] Search with invalid username — inline error shown, input still usable
- [x] Dark mode — styles correct
- [x] Mobile viewport — responsive layout holds

#### Checklist

- [x] My code follows the style guidelines of this project
- [x] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [x] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [x] New and existing unit tests pass locally with my changes
- [x] Any dependent changes have been merged and published in downstream modules

---


---

### fix(server): remove non-existent test/ dir from eslint glob
`#345` · **MERGED** · +1/−1 · https://github.com/c2siorg/Webiu/pull/345

#### Description

The default NestJS scaffold generates a `lint` script that includes the `test/` directory in its ESLint glob:

```
"lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix"
```

This project has no `test/` directory — all `*.spec.ts` files live inside `src/` alongside their source files. When the Husky pre-commit hook called `npm run lint` via `lint-staged`, ESLint attempted to resolve `test/**/*.ts` which matched nothing, leading to potential exit-code errors that could block commits unnecessarily.

**Change made:**

- Removed `test` from the ESLint glob in `webiu-server/package.json`:
  ```
  Before: "eslint \"{src,apps,libs,test}/**/*.ts\" --fix"
  After:  "eslint \"{src,apps,libs}/**/*.ts\" --fix"
  ```

**Files changed:**

- `webiu-server/package.json`

Fixes #293

#### Type of change

- [x] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] This change requires a documentation update

#### How Has This Been Tested?

- Ran `npm run lint` in `webiu-server/` — exits cleanly with no errors.
- Ran `npm test` in `webiu-server/` — all 58 existing tests pass.
- Staged a `.ts` file and ran `git commit` to confirm the Husky pre-commit hook completes without error.

- [x] `npm run lint` passes (webiu-server)
- [x] All 58 unit tests pass (`npm test`)
- [x] Husky pre-commit hook completes cleanly on a staged `.ts` change

#### Checklist

- [x] My code follows the style guidelines of this project
- [x] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [x] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [x] New and existing unit tests pass locally with my changes
- [x] Any dependent changes have been merged and published in downstream modules



---

### feat(ui): add global HTTP error interceptor for centralized error handling
`#441` · **MERGED** · +125/−39 · https://github.com/c2siorg/Webiu/pull/441

#### feat/global-http-error-interceptor · Closes #409


#### Description

Created `src/app/common/interceptors/error.interceptor.ts` — a function-based `HttpInterceptorFn` (Angular 17+ standalone pattern) with a `getUserMessage()` helper covering status 0 (network/CORS), 400, 401, 403, 404, 429, 500, 502, 503, and sensible fallbacks for all other codes. It logs `[HTTP <status>] <METHOD> <url> — <message>` and re-throws the enriched error. Registered globally in `app.config.ts` via `withInterceptors([errorInterceptor])` alongside the existing `withFetch()`. Components can optionally read `err.userMessage` to display consistent feedback without any switch/case logic.

Added `error.interceptor.spec.ts` with 8 Jasmine unit tests using `HttpTestingController`.

Fixes #409

#### Type of change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [x] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] This change requires a documentation update

#### How Has This Been Tested?

Stop the backend server, navigate to `/projects` or `/contributors`, and open DevTools → Console.

**Before (master):** raw unstructured errors or silence in the console.

**After (feat branch):** structured log lines `[HTTP 0] GET http://localhost:5050/... — Network error — please check your connection and try again.` appear for every failing request. Restart backend — pages load normally, no interference from the interceptor.

Unit tests (`error.interceptor.spec.ts`) using `HttpTestingController`:

- [x] 401 → `userMessage` contains "Unauthorized"
- [x] 403 → `userMessage` contains "Access denied"
- [x] 404 → `userMessage` contains "not found"
- [x] 429 → `userMessage` contains "Too many requests"
- [x] 500 → `userMessage` contains "Internal server error"
- [x] 503 → `userMessage` contains "unavailable"
- [x] Error object still an `HttpErrorResponse` with original `status` preserved
- [x] Successful responses pass through unmodified
- [x] `npm run lint` passes (webiu-ui)

#### Checklist:

- [x] My code follows the style guidelines of this project
- [x] I have performed a self-review of my own code
- [x] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [x] My changes generate no new warnings
- [x] I have added tests that prove my fix is effective or that my feature works
- [x] New and existing unit tests pass locally with my changes
- [x] Any dependent changes have been merged and published in downstream modules


---

### fix(ui): replace direct GitHub API calls in Community page with backend batch-social endpoint
`#442` · **MERGED** · +17/−23 · https://github.com/c2siorg/Webiu/pull/442

#### Pull Request Descriptions

---

####  fix/community-cors-fetch · Closes #403

The Community page fetched follower/following counts by making individual unauthenticated requests directly to `https://api.github.com/users/<login>` from the browser. These calls hit CORS restrictions and GitHub's 60 req/hour unauthenticated rate limit, causing follower/following counts to be missing or incorrect on the Community page.

Replace the per-user direct GitHub API calls with a single `POST /api/user/batch-social` request to the backend, which uses the authenticated token, handles batching internally, and is already cached. This is the same approach `ContributorsComponent` already uses. On failure the page degrades gracefully — contributors are shown without social counts rather than breaking entirely.

Closes #403

#### Description

`CommunityComponent.fetchFollowerData()` iterated over the top 8 contributors and fired one `this.http.get('https://api.github.com/users/<login>')` per user directly from the browser. The backend already exposes `POST /api/user/batch-social` which accepts an array of usernames and returns follower/following data using the authenticated `GITHUB_ACCESS_TOKEN` — the `ContributorsComponent` uses this exact endpoint. The Community page was never updated to follow the same pattern.

Also removed the now-unused `CommmonUtilService` injection.

Fixes #403

#### Type of change

- [x] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] This change requires a documentation update

#### How Has This Been Tested?

Start backend (`npm start`) and frontend (`ng serve`). Open `http://localhost:4200/community` with DevTools → Network → Fetch/XHR filter active and hard-refresh.

**Before (master):** 8 individual requests to `api.github.com/users/<login>` visible in Network tab; some fail with CORS or 429 errors; follower/following counts on cards show 0 or are missing.
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/636331ea-591a-4726-a1bc-484a1562e174" />
**After (fix branch):** A single `POST localhost:5050/api/user/batch-social`; zero requests to `api.github.com`; follower/following counts populated correctly on all cards.
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/6a4bb4aa-0228-49f7-96d5-27f62ce639d2" />
Kill the backend and reload — page still renders the contributor list without social counts (graceful degradation).

- [x] No direct browser requests to `api.github.com` on the Community page
- [x] Follower/following counts populated correctly via backend
- [x] Graceful degradation when `batch-social` fails
- [x] `npm run lint` passes (webiu-ui)

#### Checklist:

- [x] My code follows the style guidelines of this project
- [x] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [x] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [x] New and existing unit tests pass locally with my changes
- [x] Any dependent changes have been merged and published in downstream modules

---


---

### feat(api): standardize v1 versioning prefix across all backend 
`#482` · **MERGED** · +20/−20 · https://github.com/c2siorg/Webiu/pull/482

#### Description

Three NestJS controllers had their path prefixes updated:

| Controller | Before | After |
|---|---|---|
| ContributorController | `api/contributor` | `api/v1/contributor` |
| ProjectController | `api/projects` | `api/v1/projects` |
| IssuesController | `api/issues` | `api/v1/issues` |
| UserController | `api/user` | `api/v1/user` |

Five Angular call-sites updated in the same commit:
- `ProjectsCardComponent` — `/api/issues/issuesAndPr` → `/api/v1/issues/issuesAndPr`
- `ProjectCacheService` — all `/api/projects/*` URLs
- `ContributorSearchComponent` — `/api/contributor` and `/api/user` base URLs
- `CommunityComponent` — `/api/contributor/contributors` and `/api/user/batch-social`
- `ContributorsComponent` — same two endpoints as above

`auth.controller.ts` already uses `/api/v1/auth` and is unchanged. `oauth.controller.ts` path (`auth`) is an OAuth callback URL, not a public API endpoint, and is left as-is.

Fixes #472

#### Type of change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [x] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] This change requires a documentation update

#### How Has This Been Tested?

- [x] `npm run lint` passes (webiu-server)
- [x] `npm run lint` passes (webiu-ui)
- [x] All 78 previously-passing backend unit tests still pass (`npm test`) — the 5 pre-existing failures in `project.service.spec.ts` and `project.resolver.spec.ts` exist on the base branch before this change
- [x] Start backend (`npm run start:dev`) and frontend (`ng serve`). `/projects`, `/contributors`, `/community`, and `/search` pages all load and fetch data correctly via the new `/api/v1/` paths

#### Checklist:

- [x] My code follows the style guidelines of this project
- [x] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [x] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [x] New and existing unit tests pass locally with my changes
- [x] Any dependent changes have been merged and published in downstream modules

---


---

### test(server): fix project service and resolver spec drift
`#494` · **MERGED** · +40/−31 · https://github.com/c2siorg/Webiu/pull/494

#### Description

  Backend unit tests on webiu-2026-pre-gsoc had 5 failing tests due to test-
  suite drift after service/resolver contract updates:

  - project.service.spec.ts still mocked getOrgRepos/getRepoPulls patterns while
    ProjectService.getAllProjects() now uses getAllOrgReposSorted() +
    getRepoPullCount().
  - project.resolver.spec.ts expected a raw repository array, while resolver now
    returns paginated shape { total, page, limit, repositories }.

  This PR updates only the affected specs to match current implementation
  contracts. No runtime/backend service logic was changed.

  Fixes # (backend test drift issue)

  ## Type of change

  - [x] Bug fix (non-breaking change which fixes an issue)
  - [ ] New feature (non-breaking change which adds functionality)
  - [ ] Breaking change (fix or feature that would cause existing functionality
    to not work as expected)
  - [ ] This change requires a documentation update

  ## How Has This Been Tested?

  - Reproduced failing baseline on webiu-2026-pre-gsoc:
      - cd webiu-server
      - npm test -- --runInBand
      - Observed 5 failures in:
          - src/project/project.service.spec.ts (3)
          - src/graphql/project.resolver.spec.ts (2)
  - Verified after fixes:
      - cd webiu-server
      - npm run lint
      - npm test -- --runInBand

  Result:

  - 11/11 test suites passed
  - 83/83 tests passed
  - [x] npm run lint (webiu-server)
  - [x] npm test -- --runInBand (webiu-server)

  ## Checklist:

  - [x] My code follows the style guidelines of this project
  - [x] I have performed a self-review of my own code
  - [ ] I have commented my code, particularly in hard-to-understand areas
  - [ ] I have made corresponding changes to the documentation
  - [x] My changes generate no new warnings
  - [x] I have added tests that prove my fix is effective or that my feature
    works
  - [x] New and existing unit tests pass locally with my changes
  - [x] Any dependent changes have been merged and published in downstream
    modules



---

