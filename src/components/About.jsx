import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import profileImage from "../assets/profile.jpeg";

const ServiceCard = ({ index, title, icon }) => (
  <div className='xs:w-[250px] w-full'>
    <motion.div
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      className='w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card transform hover:scale-105 transition-transform duration-300'
      whileHover={{ scale: 1.05 }}
    >
      <div
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className='bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col'
      >
        <img
          src={icon}
          alt='web-development'
          className='w-16 h-16 object-contain'
        />

        <h3 className='text-white text-[20px] font-bold text-center'>
          {title}
        </h3>
      </div>
    </motion.div>
  </div>
);

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview.</h2>
      </motion.div>

      <div className='mt-4 flex flex-col lg:flex-row items-start gap-8'>
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className='text-secondary text-[17px] max-w-3xl leading-[30px] flex-1'
        >
          I'm a skilled software developer with experience in TypeScript and JavaScript, and expertise in frameworks like React, Node.js, and React Native. I'm a fast learner who collaborates effectively with clients across different time zones to deliver efficient, scalable, and user-friendly solutions that solve real-world problems. Let's work together to bring your ideas to life!
        </motion.p>
        <motion.div
          variants={fadeIn("left", "spring", 0.5, 0.75)}
          className='flex-shrink-0 ml-8 -mt-8'
        >
          <div className='w-56 h-56 green-pink-gradient p-[1px] rounded-full shadow-card transform hover:scale-105 transition-transform duration-300'>
            <div className='bg-tertiary rounded-full w-full h-full flex justify-center items-center'>
              <img
                src={profileImage}
                alt="Profile"
                className='w-52 h-52 rounded-full object-cover'
              />
            </div>
          </div>
        </motion.div>
      </div>

      <div className='mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10'>
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
