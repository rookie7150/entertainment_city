-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2024-10-21 07:00:13
-- 伺服器版本： 10.4.32-MariaDB
-- PHP 版本： 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `c110156109`
--

-- --------------------------------------------------------

--
-- 資料表結構 `user`
--

CREATE TABLE `user` (
  `userName` varchar(20) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `address` varchar(30) NOT NULL,
  `pay` varchar(15) NOT NULL,
  `account` varchar(30) NOT NULL,
  `password` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `Verification_code` varchar(4) DEFAULT NULL,
  `enable` varchar(1) NOT NULL DEFAULT '0',
  `balance` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `user`
--

INSERT INTO `user` (`userName`, `phone`, `address`, `pay`, `account`, `password`, `email`, `Verification_code`, `enable`, `balance`) VALUES
('player', '123', '123', '123', '123', '123', 'C110156104@nkust.edu.tw', '1294', '1', 3360),
('ray', '090598321', '132312', '312312', '3212312', '123', 'ray107743949@gmail.com', '3925', '1', 208),
('visitor', '000', '000', '000', '000', '000', '000', '000', '2', 0),
('晴晴', '123', 'dadwad', 'dwadwa', 'dwadwa', 'dwadwa', 'apple051522@gmail.com', '1870', '', 0);

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userName`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
