/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 80032 (8.0.32)
 Source Host           : localhost:3306
 Source Schema         : charityevents_db

 Target Server Type    : MySQL
 Target Server Version : 80032 (8.0.32)
 File Encoding         : 65001

*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of categories
-- ----------------------------
INSERT INTO `categories` VALUES (1, 'Education Support');
INSERT INTO `categories` VALUES (2, 'Elderly Care');
INSERT INTO `categories` VALUES (3, 'Medical Assistance');
INSERT INTO `categories` VALUES (4, 'Environmental Protection');
INSERT INTO `categories` VALUES (5, 'Disaster Relief');
INSERT INTO `categories` VALUES (7, 'Animal Protection');

-- ----------------------------
-- Table structure for events
-- ----------------------------
DROP TABLE IF EXISTS `events`;
CREATE TABLE `events`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `date` datetime NULL DEFAULT NULL,
  `category_id` int NULL DEFAULT NULL,
  `organizer_id` int NULL DEFAULT NULL,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `target_price` decimal(10, 2) NULL DEFAULT NULL,
  `detail` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `event_status` int NULL DEFAULT NULL COMMENT '0:已结束，1:进行中',
  `ban_status` int NULL DEFAULT NULL COMMENT '0:暂停，1:正常',
  `ticket_price` decimal(10, 2) NULL DEFAULT NULL,
  `current_price` decimal(10, 2) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `organizer`(`organizer_id` ASC) USING BTREE,
  INDEX `category_id`(`category_id` ASC) USING BTREE,
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `organizer` FOREIGN KEY (`organizer_id`) REFERENCES `organization` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of events
-- ----------------------------
INSERT INTO `events` VALUES (1, 'Love Aid Education Program', '2025-06-15 09:00:00', 1, 1, 'Beijing', 1000000.00, 'Provide tuition, book fees and nutritional subsidies for poor students in mountainous areas, helping children complete their academic dreams', 0, 1, 200.00, 785.00);
INSERT INTO `events` VALUES (2, 'Warm Winter Action', '2025-11-20 10:00:00', 2, 2, 'Shanghai', 300000.00, 'Provide winter clothes, heating equipment and daily necessities for lonely elderly people in the community, helping them spend winter warmly', 1, 1, 333.00, 548.00);
INSERT INTO `events` VALUES (3, 'Medical Assistance Fund', '2025-07-11 00:00:00', 3, 3, 'Liuzhou', 1500000.00, 'Provide surgical treatment cost support for difficult patients from poor families, saving lives and protecting health', 0, 1, 555.00, 248.00);
INSERT INTO `events` VALUES (4, 'Environmental Public Welfare Action', '2025-09-28 00:00:00', 4, 4, 'Nanning', 500000.00, 'Organize volunteers for garbage classification, tree planting and other environmental activities, building a green home together', 1, 1, 458.00, 219.00);
INSERT INTO `events` VALUES (5, 'Disaster Relief and Charity Rescue', '2025-10-07 00:00:00', 5, 5, 'Guangzhou', 2000000.00, 'Provide food, drinking water and temporary accommodation for people affected by recent flood disasters, offering emergency assistance to affected compatriots', 1, 0, 358.00, 322.00);
INSERT INTO `events` VALUES (6, 'Love Library Project', '2025-11-28 00:00:00', 1, 1, 'Shenzhen', 800000.00, 'Establish love libraries in remote area schools, providing books and learning materials, enriching children\'s reading life', 1, 1, 568.00, 591.00);
INSERT INTO `events` VALUES (7, 'Vocational Training for Disabled Persons', '2025-10-24 00:00:00', 1, 6, 'Chongqing', 600000.00, 'Provide vocational skills training for disabled persons, helping them obtain employment opportunities and realize self-worth', 1, 1, 236.00, 2998.00);
INSERT INTO `events` VALUES (8, 'Stray Animal Rescue', '2025-11-27 00:00:00', 7, 7, 'Chengdu', 400000.00, 'Rescue stray cats and dogs, provide medical care, shelter and adoption services, giving stray animals a warm home', 1, 0, 888.00, 5698.00);
INSERT INTO `events` VALUES (9, 'Test Suspended', '2025-09-30 00:00:00', 1, 1, 'Changsha', 2000.00, 'Testing illegal activity', 0, 0, 999.00, 659.00);

-- ----------------------------
-- Table structure for organization
-- ----------------------------
DROP TABLE IF EXISTS `organization`;
CREATE TABLE `organization`  (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of organization
-- ----------------------------
INSERT INTO `organization` VALUES (1, 'Love Education Foundation', '123@qq.com');
INSERT INTO `organization` VALUES (2, 'Warm Elderly Care Center', '123@qq.com');
INSERT INTO `organization` VALUES (3, 'Health Medical Assistance Association', '123@qq.com');
INSERT INTO `organization` VALUES (4, 'Green Environmental Alliance', '123@qq.com');
INSERT INTO `organization` VALUES (5, 'Emergency Relief Foundation', '123@qq.com');
INSERT INTO `organization` VALUES (6, 'Hope Employment Assistance Center', '123@qq.com');
INSERT INTO `organization` VALUES (7, 'Animal Protection Association', '123@qq.com');
INSERT INTO `organization` VALUES (8, 'Children Welfare Foundation', '123@qq.com');

-- ----------------------------
-- Table structure for registrations
-- ----------------------------
DROP TABLE IF EXISTS `registrations`;
CREATE TABLE `registrations`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '唯一标识符',
  `event_id` int NOT NULL COMMENT '外键，引用events表的id',
  `user_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '用户姓名',
  `user_email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '用户邮箱（用于识别用户）',
  `registration_date` datetime NULL DEFAULT NULL COMMENT '注册日期',
  `ticket_count` int NULL DEFAULT NULL COMMENT '购买票数',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_registration`(`event_id` ASC, `user_email` ASC) USING BTREE COMMENT '确保每个用户对每个事件只能注册一次',
  CONSTRAINT `registrations_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '存储用户事件注册信息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of registrations
-- ----------------------------
INSERT INTO `registrations` VALUES (1, 1, 'John Doe', 'john@qq.com', '2025-06-10 09:00:00', 2);
INSERT INTO `registrations` VALUES (2, 1, 'Jane Smith', 'jane@126.com', '2025-06-12 10:00:00', 1);
INSERT INTO `registrations` VALUES (3, 2, 'Bob Johnson', 'bob@163.com', '2025-10-15 11:00:00', 3);
INSERT INTO `registrations` VALUES (4, 3, 'Alice Brown', 'alice@scu.edu.cn', '2025-07-01 12:00:00', 1);
INSERT INTO `registrations` VALUES (5, 4, 'Charlie Davis', 'charlie@scu.edu.cn', '2025-09-20 13:00:00', 4);
INSERT INTO `registrations` VALUES (6, 5, 'Eva Wilson', 'eva@scu.edu.cn', '2025-10-01 14:00:00', 2);
INSERT INTO `registrations` VALUES (7, 6, 'Frank Miller', 'frank@scu.edu.cn', '2025-10-20 15:00:00', 1);
INSERT INTO `registrations` VALUES (8, 7, 'Grace Lee', 'grace@scu.edu.cn', '2025-10-20 16:00:00', 3);
INSERT INTO `registrations` VALUES (9, 8, 'Henry Garcia', 'henry@scu.edu.cn', '2025-10-25 17:00:00', 2);
INSERT INTO `registrations` VALUES (10, 9, 'Ivy Martinez', 'ivy@scu.edu.cn', '2025-09-25 18:00:00', 5);

SET FOREIGN_KEY_CHECKS = 1;
