CREATE DATABASE IF NOT EXISTS `lms_portal`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE `lms_portal`;

CREATE TABLE IF NOT EXISTS teachers (
    teacherID VARCHAR(255) NOT NULL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL, 
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    userID VARCHAR(255) NOT NULL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL, 
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    enrollmentID VARCHAR(255) NOT NULL,
    FOREIGN KEY (enrollmentID) REFERENCES enrollments(enrollmentID)
);


CREATE TABLE IF NOT EXISTS enrollments (
    enrollmentID VARCHAR(255) NOT NULL PRIMARY KEY,
    courseID VARCHAR(255) NOT NULL,
    userID VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (courseID) REFERENCES courses(courseID),
    FOREIGN KEY (userID) REFERENCES users(userID)
);

CREATE TABLE IF NOT EXISTS courses (
    courseID VARCHAR(255) NOT NULL PRIMARY KEY,
    courseName VARCHAR(255) NOT NULL,
    courseDescription TEXT NOT NULL,
    courseCategory VARCHAR(255) NOT NULL,
    courseDuration VARCHAR(255) NOT NULL,
    coursePrice DECIMAL(10, 2) NOT NULL,
    courseDifficulty VARCHAR(255) NOT NULL,
    courseOutcome TEXT NOT NULL,
    courseLanguage VARCHAR(255) NOT NULL,
    courseInstructor VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    teacherID VARCHAR(255) NOT NULL,
    courseStatus VARCHAR(255) NOT NULL,
    courseImage VARCHAR(255) NOT NULL,
    courseRating DECIMAL(10, 2) NOT NULL,
    studentEnrolled INT NOT NULL,
    studentEnrolledID VARCHAR(255) NOT NULL,
    FOREIGN KEY (studentEnrolledID) REFERENCES users(userID),
    FOREIGN KEY (teacherID) REFERENCES teachers(teacherID)
);

CREATE TABLE IF NOT EXISTS courseContent (
    contentID VARCHAR(255) NOT NULL PRIMARY KEY,
    courseID VARCHAR(255) NOT NULL,
    contentTitle VARCHAR(255) NOT NULL,
    contentDescription TEXT NOT NULL,
    contentURL VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (courseID) REFERENCES courses(courseID)
);


CREATE TABLE IF NOT EXISTS assessments (
    assessmentID VARCHAR(255) NOT NULL PRIMARY KEY,
    courseID VARCHAR(255) NOT NULL,
    assessmentTitle VARCHAR(255) NOT NULL,
    assessmentDescription TEXT NOT NULL,
    assessmentURL VARCHAR(255) NOT NULL,
    generateAIQuestion BOOLEAN NOT NULL,
    contentID VARCHAR(255) NOT NULL,
    courseContentID VARCHAR(255) NOT NULL,
    assessmentDeadline TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (courseID) REFERENCES courses(courseID),
    FOREIGN KEY (courseContentID) REFERENCES courseContent(contentID)
);