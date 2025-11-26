// src/App.jsx
import React, { useEffect, useState, useCallback } from "react";
import PlayersCardsBootstrap from "./components/playerCards";
import PlayersCarousel from "./components/playerCarousel";
import "./App.css"

/**
 * Editable Gist JSON editor for players_list.json
 *
 * - Loads gist file content (players_list.json) and parses it to an array.
 * - Renders editable fields for each item.
 * - Allows add / remove / edit rows.
 * - PATCHes the gist file when you click "Save to Gist".
 *
 * Local testing (unsafe): store your PAT in localStorage key "GH_TOKEN".
 * Production: create a serverless /api/data endpoint and switch save/load to use that.
 */
export default function App() {
  const GIST_ID = process.env.REACT_APP_GIST_ID; // or read from env/server later
  const FILE_NAME = "players_list.json";
  const GIST_API = `https://api.github.com/gists/${GIST_ID}`;

  const [players, setPlayers] = useState(null); // parsed array
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(process.env.REACT_APP_GITHUB_TOKEN);

  // fetch(`${GIST_API}?t=${Date.now()}`, {

//   var dummydata =[
//   {
//     "SrNo": 1,
//     "Team": "Bombaywala 11",
//     "Submission": "11-18-2025 13:54:24",
//     "PlayerName": "Darshit Yogesh Vohra",
//     "Address": "Surendragarh Seminary hills near Gupta chowk, Nagpur",
//     "DOB": "03-03-2008",
//     "Contact": "8484919018",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 2,
//     "Team": "Bombaywala 11",
//     "Submission": "11-20-2025 15:18:46",
//     "PlayerName": "Hritik Omprakash Vyas",
//     "Address": "Civil lines",
//     "DOB": "21-10-1998",
//     "Contact": "8975705008",
//     "Speciality": "बोदलंग",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 3,
//     "Team": "Bombaywala 11",
//     "Submission": "11-21-2025 18:33:32",
//     "PlayerName": "Pratik Omprakash Vyas",
//     "Address": "Civil lines",
//     "DOB": "20-03-2001",
//     "Contact": "7843085584",
//     "Speciality": "Batting",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 4,
//     "Team": "Bombaywala 11",
//     "Submission": "11-19-2025 14:00:54",
//     "PlayerName": "Rishabh Pradeep Vyas",
//     "Address": "Nagpur",
//     "DOB": "10-09-2002",
//     "Contact": "8975577008",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 5,
//     "Team": "Bombaywala 11",
//     "Submission": "11-19-2025 14:10:05",
//     "PlayerName": "Rushab Thakur",
//     "Address": "F402 White Pelican Nava Naroda Road, Hanspura, Ahmedabad - 382330",
//     "DOB": "07-02-1999",
//     "Contact": "9924717402",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 6,
//     "Team": "CSKk",
//     "Submission": "11-19-2025 10:50:52",
//     "PlayerName": "Nayan Mahesh Trivedi",
//     "Address": "Seminary hills, Manav Seva Nagar, Nagpur",
//     "DOB": "13-10-1999",
//     "Contact": "7028133306",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 7,
//     "Team": "CSK",
//     "Submission": "11-19-2025 10:52:59",
//     "PlayerName": "Mahesh Pannalalji Trivedi",
//     "Address": "Seminary hills, Manav Seva Nagar, Nagpur",
//     "DOB": "25-09-1973",
//     "Contact": "7391999711",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 8,
//     "Team": "CSK",
//     "Submission": "11-22-2025 10:07:54",
//     "PlayerName": "Navneet Mahesh Trivedi",
//     "Address": "Seminary hills, Manav Seva Nagar, Nagpur",
//     "DOB": "06-03-2002",
//     "Contact": "9561794502",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 9,
//     "Team": "CSK",
//     "Submission": "11-19-2025 18:46:16",
//     "PlayerName": "Dipesh Ravindra Dave",
//     "Address": "Near Shanti Bhavan, Golchha Marg, Karachi Line, Sadar, Nagpur",
//     "DOB": "20-06-1995",
//     "Contact": "8975975715",
//     "Speciality": "All-Rounder",
//     "Fees": "Bal"
//   },
//   {
//     "SrNo": 10,
//     "Team": "CSK",
//     "Submission": "11-22-2025 10:56:34",
//     "PlayerName": "Ayush Murli Joshi",
//     "Address": "Surendra ghad, Seminary hills, Nagpur",
//     "DOB": "03-10-2004",
//     "Contact": "9075857808",
//     "Speciality": "All-Rounder",
//     "Fees": "Bal"
//   },
//   {
//     "SrNo": 11,
//     "Team": "Director King - Srimali Warriors",
//     "Submission": "11-18-2025 12:13:21",
//     "PlayerName": "Mayur Ajay Vyas",
//     "Address": "Ajay Vyas",
//     "DOB": "12-11-1990",
//     "Contact": "6301642515",
//     "Speciality": "All-Rounder",
//     "Fees": "Bal"
//   },
//   {
//     "SrNo": 12,
//     "Team": "Director King - Srimali Warriors",
//     "Submission": "11-20-2025 18:29:46",
//     "PlayerName": "Pratiek Satish Vyas",
//     "Address": "Satish Vyas",
//     "DOB": "10-05-2006",
//     "Contact": "7206470370",
//     "Speciality": "All-Rounder",
//     "Fees": "Bal"
//   },
//   {
//     "SrNo": 13,
//     "Team": "Director King - Srimali Warriors",
//     "Submission": "11-19-2025 18:45:14",
//     "PlayerName": "Atharva Joshi",
//     "Address": "Zenda chowk, Dharampeth, Nagpur",
//     "DOB": "28-02-2025",
//     "Contact": "8421473397",
//     "Speciality": "Batting",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 14,
//     "Team": "Director King - Srimali Warriors",
//     "Submission": "11-19-2025 19:01:35",
//     "PlayerName": "Akshad Manoj Joshi",
//     "Address": "604 Bhagwaghar Complex, opp Naturals Ice Cream, Dharampeth",
//     "DOB": "19-03-2005",
//     "Contact": "8788060029",
//     "Speciality": "Batting",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 15,
//     "Team": "Director King - Srimali Warriors",
//     "Submission": "11-19-2025 19:23:13",
//     "PlayerName": "Roshan Manishi Joshi",
//     "Address": "Bhagwaghar Complex, opp Natural Ice-cream, Dharampeth",
//     "DOB": "24-12-1997",
//     "Contact": "7020080425",
//     "Speciality": "Keeping",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 16,
//     "Team": "Director King - Srimali Warriors",
//     "Submission": "11-23-2025 15:12:33",
//     "PlayerName": "Pratik Ajay Vyas",
//     "Address": "New Itwari Road, Nagpur",
//     "DOB": "01-12-5",
//     "Contact": "9860039432",
//     "Speciality": "Bowling",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 17,
//     "Team": "KKR",
//     "Submission": "11-18-2025 12:07:33",
//     "PlayerName": "Dilip Liladhar Trivedi",
//     "Address": "Gandhi Putla CA Road, Nagpur",
//     "DOB": "19-01-1983",
//     "Contact": "9923992000",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 18,
//     "Team": "KKR",
//     "Submission": "11-19-2025 9:33:29",
//     "PlayerName": "Toshi Girish Trivedi",
//     "Address": "Badkas chowk, Mahal, Nagpur",
//     "DOB": "24-08-1993",
//     "Contact": "9096806858",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 19,
//     "Team": "KKR",
//     "Submission": "11-19-2025 18:47:05",
//     "PlayerName": "Saurav Nitin Trivedi",
//     "Address": "Nagpur",
//     "DOB": "16-12-1999",
//     "Contact": "8766728876",
//     "Speciality": "Batting",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 20,
//     "Team": "KKR",
//     "Submission": "11-21-2025 11:06:03",
//     "PlayerName": "Nitin Shantilal Trivedi",
//     "Address": "Nagpur",
//     "DOB": "05-11-1974",
//     "Contact": "9823103080",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 21,
//     "Team": "KKR",
//     "Submission": "11-21-2025 11:51:11",
//     "PlayerName": "Gaurav Dave",
//     "Address": "Badkas Square, Chitaroli",
//     "DOB": "28-03-2003",
//     "Contact": "9307667179",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 22,
//     "Team": "Nagpur Titans",
//     "Submission": "11-19-2025 13:58:30",
//     "PlayerName": "Ujjwal Oza",
//     "Address": "Seminary Hills, Nagpur",
//     "DOB": "12-07-2004",
//     "Contact": "9579224450",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 23,
//     "Team": "Nagpur Titans",
//     "Submission": "11-21-2025 17:26:53",
//     "PlayerName": "Yogesh Harish Ojha",
//     "Address": "Opp plot no 85, Gajanan Prasaad Society, Seminary Hills, Nagpur 440006",
//     "DOB": "02-11-2000",
//     "Contact": "7843061681",
//     "Speciality": "All-Rounder",
//     "Fees": "Bal"
//   },
//   {
//     "SrNo": 24,
//     "Team": "Nagpur Titans",
//     "Submission": "11-23-2025 14:05:42",
//     "PlayerName": "Shubham Ramchandra Ozha",
//     "Address": "Surendragad",
//     "DOB": "15-09-1995",
//     "Contact": "7620218345",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 25,
//     "Team": "Nagpur Titans",
//     "Submission": "11-23-2025 15:11:04",
//     "PlayerName": "Priyanshu Vyas",
//     "Address": "Village Karoli, Post Chikarda, Teh Bhadesar, Dist Chittorgarh (Rajasthan)",
//     "DOB": "05-03-2007",
//     "Contact": "9116499711",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 26,
//     "Team": "Nagpur Titans",
//     "Submission": "11-23-2025 15:19:00",
//     "PlayerName": "Deepesh Ramchandra Ozha",
//     "Address": "Surendragad",
//     "DOB": "16-09-2000",
//     "Contact": "9975128149",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 27,
//     "Team": "SSS",
//     "Submission": "11-19-2025 00:59:03",
//     "PlayerName": "Ashwary Shrimali",
//     "Address": "Sukhadia Nagar, Nathdwara",
//     "DOB": "18-11-1994",
//     "Contact": "7615833544",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 28,
//     "Team": "SSS",
//     "Submission": "11-20-2025 17:22:17",
//     "PlayerName": "Rajat Bhavanishankar Ji Joshi",
//     "Address": "Plot no 89, Kolbaswami Society, Hazaripahad",
//     "DOB": "15-03-1990",
//     "Contact": "9595393929",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 29,
//     "Team": "SSS",
//     "Submission": "11-21-2025 07:55:11",
//     "PlayerName": "Anil Bhawrlal Vyas",
//     "Address": "Surendragarh, near Renuka Jewellers, Bajrang Chowk, Seminary Hills",
//     "DOB": "05-09-1984",
//     "Contact": "8390131791",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 30,
//     "Team": "SSS",
//     "Submission": "11-18-2025 23:45:46",
//     "PlayerName": "Umesh Rajesh Dave",
//     "Address": "Surendra gadh, Seminary Hills, Nagpur",
//     "DOB": "07-10-1990",
//     "Contact": "8624007646",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 31,
//     "Team": "Not Reserved",
//     "Submission": "11-18-2025 12:09:54",
//     "PlayerName": "Mitesh Trivedi",
//     "Address": "Badkas chowk, Mahal",
//     "DOB": "04-03-1988",
//     "Contact": "9356202977",
//     "Speciality": "Batting",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 32,
//     "Team": "Not Reserved",
//     "Submission": "11-18-2025 12:13:01",
//     "PlayerName": "Satish Omprakash Dave",
//     "Address": "137 Abhyankar Nagar, Zenda Chowk, Nagpur",
//     "DOB": "10-02-1986",
//     "Contact": "9960432333",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 33,
//     "Team": "Not Reserved",
//     "Submission": "11-18-2025 17:45:53",
//     "PlayerName": "Dipesh Joshi",
//     "Address": "Surendragadh Seminary Hills, Nagpur",
//     "DOB": "01-07-1994",
//     "Contact": "8446519783",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 34,
//     "Team": "Not Reserved",
//     "Submission": "11-19-2025 14:42:17",
//     "PlayerName": "Rishi Dave",
//     "Address": "Raipur, Chhattisgarh",
//     "DOB": "12-09-2010",
//     "Contact": "8269662696",
//     "Speciality": "Batting",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 35,
//     "Team": "Not Reserved",
//     "Submission": "11-19-2025 18:27:35",
//     "PlayerName": "Rakesh Joshi",
//     "Address": "Surendragard Veterinary College, Near Radha Krishna Mandir, Behind Vinayak Stores, Nagpur",
//     "DOB": "03-10-1989",
//     "Contact": "9021419629",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 36,
//     "Team": "Not Reserved",
//     "Submission": "11-20-2025 09:07:51",
//     "PlayerName": "Yashkumar Arjunji Dave",
//     "Address": "Chotta Tajbag, Nagpur",
//     "DOB": "16-10-1988",
//     "Contact": "9595291329",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 37,
//     "Team": "Not Reserved",
//     "Submission": "11-20-2025 09:36:53",
//     "PlayerName": "Jitesh Trivedi",
//     "Address": "Badkas chowk, RSS Building, Mahal, Nagpur",
//     "DOB": "24-07-2025",
//     "Contact": "9172172598",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 38,
//     "Team": "Not Reserved",
//     "Submission": "11-20-2025 11:43:21",
//     "PlayerName": "Bhavesh Rajesh Trivedi",
//     "Address": "Seminary Hills B/H Veterinary College, Nagpur",
//     "DOB": "14-09-2002",
//     "Contact": "8983826746",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 39,
//     "Team": "Not Reserved",
//     "Submission": "11-20-2025 11:46:32",
//     "PlayerName": "Mayur Trivedi",
//     "Address": "Chitaroli Mahal, Nagpur",
//     "DOB": "05-05-1998",
//     "Contact": "7620465605",
//     "Speciality": "Bowling",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 40,
//     "Team": "Not Reserved",
//     "Submission": "11-20-2025 15:42:35",
//     "PlayerName": "Vijay Shrimali",
//     "Address": "Near RSS Building, Badkas Chowk",
//     "DOB": "25-02-1988",
//     "Contact": "7020438080",
//     "Speciality": "All-Rounder",
//     "Fees": "Bal"
//   },
//   {
//     "SrNo": 41,
//     "Team": "Not Reserved",
//     "Submission": "11-20-2025 15:56:13",
//     "PlayerName": "Kulbhushan Nirmalji Trivedi",
//     "Address": "Badkas Sq, Nagpur",
//     "DOB": "14-02-1992",
//     "Contact": "7020427658",
//     "Speciality": "Batting",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 42,
//     "Team": "Not Reserved",
//     "Submission": "11-20-2025 17:01:09",
//     "PlayerName": "Harshvardhan Ramesh Vyas",
//     "Address": "Raipur",
//     "DOB": "03-08-1986",
//     "Contact": "8602639300",
//     "Speciality": "All-Rounder",
//     "Fees": "Bal"
//   },
//   {
//     "SrNo": 43,
//     "Team": "Not Reserved",
//     "Submission": "11-21-2025 09:37:59",
//     "PlayerName": "Shekhar Dave",
//     "Address": "Chotta Tajbag, Nagpur",
//     "DOB": "22-02-1987",
//     "Contact": "8955221787",
//     "Speciality": "Bowling",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 44,
//     "Team": "Not Reserved",
//     "Submission": "11-21-2025 11:51:02",
//     "PlayerName": "Pawan Nilkanth Joshi",
//     "Address": "707 Amaltas near Shahu, Atta Chakki, Jaitala Road, Nagpur",
//     "DOB": "21-10-1987",
//     "Contact": "7875127431",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 45,
//     "Team": "Not Reserved",
//     "Submission": "11-21-2025 15:40:47",
//     "PlayerName": "Saurabh Mahendra Dave",
//     "Address": "Raghuji Nagar, Chotta Taj Bag, Bhosale Wada, Nagpur",
//     "DOB": "28-10-2001",
//     "Contact": "9834275607",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 46,
//     "Team": "Not Reserved",
//     "Submission": "11-21-2025 16:39:28",
//     "PlayerName": "Prince Deepak Trivedi",
//     "Address": "Seminary Hills, Manav Seva Nagar",
//     "DOB": "10-12-2009",
//     "Contact": "7219225745",
//     "Speciality": "Batting",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 47,
//     "Team": "Not Reserved",
//     "Submission": "11-21-2025 16:47:11",
//     "PlayerName": "Himanshu Yugalkishore Vidawat",
//     "Address": "G.G. Complex, Friends Colony, Nagpur",
//     "DOB": "30-01-2010",
//     "Contact": "9423118826",
//     "Speciality": "All-Rounder",
//     "Fees": "Bal"
//   },
//   {
//     "SrNo": 48,
//     "Team": "Not Reserved",
//     "Submission": "11-21-2025 17:21:30",
//     "PlayerName": "Pankaj Bhavarlal Trivedi",
//     "Address": "Veterinary College, Manav Seva Nagar",
//     "DOB": "17-10-1982",
//     "Contact": "9890846624",
//     "Speciality": "Batting",
//     "Fees": "Bal"
//   },
//   {
//     "SrNo": 49,
//     "Team": "Not Reserved",
//     "Submission": "11-21-2025 17:54:35",
//     "PlayerName": "Hardik Devendra Ozha",
//     "Address": "Seminary Hills, Nagpur",
//     "DOB": "12-09-2012",
//     "Contact": "9579518442",
//     "Speciality": "All-Rounder",
//     "Fees": "Bal"
//   },
//   {
//     "SrNo": 50,
//     "Team": "Not Reserved",
//     "Submission": "11-22-2025 14:17:53",
//     "PlayerName": "Dinesh Himmatlal Joshi",
//     "Address": "Seminary Hills, Manav Seva Nagar, behind Elizabeth School",
//     "DOB": "25-12-1990",
//     "Contact": "7620180459",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 51,
//     "Team": "Not Reserved",
//     "Submission": "11-22-2025 14:48:06",
//     "PlayerName": "Krishna Manoj Dave",
//     "Address": "Chitaroli, Badkas Chowk, Mahal",
//     "DOB": "06-09-2007",
//     "Contact": "8668376056",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 52,
//     "Team": "Not Reserved",
//     "Submission": "11-22-2025 15:13:25",
//     "PlayerName": "Shekhar",
//     "Address": "Plot no 156, Chotta Tagbag, Bhosle Wada, Nagpur",
//     "DOB": "02-02-1986",
//     "Contact": "8055221786",
//     "Speciality": "All-Rounder",
//     "Fees": "Bal"
//   },
//   {
//     "SrNo": 53,
//     "Team": "Not Reserved",
//     "Submission": "11-22-2025 17:48:36",
//     "PlayerName": "Riddham Hemant Vyas",
//     "Address": "Civil lines",
//     "DOB": "30-12-2010",
//     "Contact": "07620928284",
//     "Speciality": "Bowling",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 54,
//     "Team": "Not Reserved",
//     "Submission": "11-22-2025 20:06:52",
//     "PlayerName": "Jeet Bhupesh Dave",
//     "Address": "Badkas chowk, Chita roli, behind Ghatate Building, Kasturi Krupa",
//     "DOB": "29-12-2008",
//     "Contact": "8983268696",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 55,
//     "Team": "Not Reserved",
//     "Submission": "11-23-2025 08:52:37",
//     "PlayerName": "Ravi Gopalkrishna Dave",
//     "Address": "Bungalow no 65, Shanti Villa, Dindoli Circle, Surat",
//     "DOB": "08-06-1987",
//     "Contact": "9924756661",
//     "Speciality": "Batting",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 56,
//     "Team": "Not Reserved",
//     "Submission": "11-23-2025 15:32:18",
//     "PlayerName": "Jay Dilip Dave",
//     "Address": "Atrey Layout, Pratap Nagar, Nagpur",
//     "DOB": "29-05-1993",
//     "Contact": "8888842220",
//     "Speciality": "All-Rounder",
//     "Fees": "Bal"
//   },
//   {
//     "SrNo": 57,
//     "Team": "Not Reserved",
//     "Submission": "11-24-2025 07:18:51",
//     "PlayerName": "Yaksh Anil Vyas",
//     "Address": "Surendragh Renuka Jewellers, Bajrang Chowk, Seminary Hills",
//     "DOB": "13-08-2012",
//     "Contact": "7507983348",
//     "Speciality": "All-Rounder",
//     "Fees": "Bal"
//   },
//   {
//     "SrNo": 58,
//     "Team": "Not Reserved",
//     "Submission": "11-24-2025 19:31:31",
//     "PlayerName": "Yuvraj Trivedi",
//     "Address": "410 C.A Road, opp Gandhibag Garden, Barwasan Corporation",
//     "DOB": "08-09-2010",
//     "Contact": "9511633035",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 59,
//     "Team": "Not Reserved",
//     "Submission": "11-24-2025 20:23:38",
//     "PlayerName": "Nishant Shrimali",
//     "Address": "Mahal, Nagpur",
//     "DOB": "05-04-1996",
//     "Contact": "7410093103",
//     "Speciality": "Bowling",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 60,
//     "Team": "Not Reserved",
//     "Submission": "11-24-2025 20:27:21",
//     "PlayerName": "Meet Harish Trivedi",
//     "Address": "Badkas Square",
//     "DOB": "25-11-2005",
//     "Contact": "9325005280",
//     "Speciality": "Batting",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 61,
//     "Team": "Not Reserved",
//     "Submission": "11-24-2025 20:58:23",
//     "PlayerName": "Bharat Manish Vyas",
//     "Address": "6 B Swagat Nagar, Hudkeshwar Road, Nagpur",
//     "DOB": "10-10-1991",
//     "Contact": "9579249091",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 62,
//     "Team": "Not Reserved",
//     "Submission": "11-24-2025 21:11:22",
//     "PlayerName": "Punit Umendra Shrimali",
//     "Address": "Kothi Road, Mahal, Nagpur",
//     "DOB": "22-11-2000",
//     "Contact": "9146115807",
//     "Speciality": "Bowling",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 63,
//     "Team": "SSS",
//     "Submission": "11-25-2025 13:37:04",
//     "PlayerName": "Kapil Shrimali",
//     "Address": "Surendra gadh, Seminary Hills, Nagpur",
//     "DOB": "24-12-2000",
//     "Contact": "7023470271",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 64,
//     "Team": "Not Reserved",
//     "Submission": "11-25-2025 14:49:23",
//     "PlayerName": "Yash Shrimali",
//     "Address": "Nagpur",
//     "DOB": "04-08-1996",
//     "Contact": "9672313783",
//     "Speciality": "Batting",
//     "Fees": "Bal"
//   },
//   {
//     "SrNo": 65,
//     "Team": "Not Reserved",
//     "Submission": "11-25-2025 17:06:50",
//     "PlayerName": "Yugal Shantilal Vyas",
//     "Address": "Manav Seva Nagar, Nagpur",
//     "DOB": "13-06-1984",
//     "Contact": "9665630671",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 66,
//     "Team": "Not Reserved",
//     "Submission": "11-25-2025 18:15:00",
//     "PlayerName": "Joyal Dilip Joshi",
//     "Address": "Society, near Elizabeth School, Seminary Hills",
//     "DOB": "02-05-1989",
//     "Contact": "7387575151",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 67,
//     "Team": "Not Reserved",
//     "Submission": "11-25-2025 19:02:09",
//     "PlayerName": "Himanshu Yugalkishore Vidawat",
//     "Address": "Keshri Pushp Niwas, Seminary Hills, Nagpur",
//     "DOB": "30-01-2010",
//     "Contact": "9423118816",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 68,
//     "Team": "Not Reserved",
//     "Submission": "11-25-2025 20:31:36",
//     "PlayerName": "Jay Gopalji Trivedi",
//     "Address": "Badkas Sq, Mahal, Nagpur",
//     "DOB": "10-03-1995",
//     "Contact": "9767396288",
//     "Speciality": "Batting",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 69,
//     "Team": "Not Reserved",
//     "Submission": "11-25-2025 21:04:23",
//     "PlayerName": "Yugalkishore Kesarilal Vidawat",
//     "Address": "Kesari Pushp Niwas, Seminary Hills, Nagpur",
//     "DOB": "01-06-1978",
//     "Contact": "9423118816",
//     "Speciality": "All-Rounder",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 70,
//     "Team": "Not Reserved",
//     "Submission": "11-25-2025 22:16:55",
//     "PlayerName": "Nitin Trivedi",
//     "Address": "Mumbai",
//     "DOB": "26-07-1996",
//     "Contact": "9461956184",
//     "Speciality": "Batting",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 71,
//     "Team": "Not Reserved",
//     "Submission": "11-25-2025 22:46:22",
//     "PlayerName": "Anup Ojha",
//     "Address": "Surendra gadh, Nagpur",
//     "DOB": "29-03-2001",
//     "Contact": "9309109229",
//     "Speciality": "Batting",
//     "Fees": "Rec"
//   },
//   {
//     "SrNo": 72,
//     "Team": "Not Reserved",
//     "Submission": "11-25-2025 23:19:29",
//     "PlayerName": "Mohit Vyas",
//     "Address": "Chikarda, Teh Bhadesar, Dist Chittorgarh",
//     "DOB": "15-09-2001",
//     "Contact": "9509273772",
//     "Speciality": "All-Rounder",
//     "Fees": "Bal"
//   }
// ]

// console.log("dummydata",dummydata);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${GIST_API}?t=${Date.now()}`, {
        headers: { Authorization: `token ${token}`, Accept: "application/vnd.github+json" }, // public read
    
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Gist fetch failed ${res.status}: ${txt}`);
      }
      const gist = await res.json();
      const file = gist.files && gist.files[FILE_NAME];
      if (!file) throw new Error(`${FILE_NAME} not found in gist`);
      const parsed = JSON.parse(file.content);
      // ensure we have an array (if top-level object, adapt accordingly)
      const arr = Array.isArray(parsed) ? parsed : parsed.items ?? parsed;
      setPlayers(Array.isArray(arr) ? arr : []);
    } catch (err) {
      setError(err.message || String(err));
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // helpers for editing
  function updateItem(index, field, value) {
    setPlayers((prev) => {
      const copy = (prev || []).map((it) => ({ ...it }));
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  }

  function addRow() {
    setPlayers((prev) => [
      ...(prev || []),
      {
        SrNo: (prev?.length ?? 0) + 1,
        Team: "",
        Submission: "",
        PlayerName: "",
        Address: "",
        DOB: "",
        Contact: "",
        Speciality: "",
        Fees: "",
      },
    ]);
  }

  function removeRow(index) {
    setPlayers((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((it, i) => ({ ...it, SrNo: i + 1 }))
    );
  }

  // save token locally (for local testing)
  function saveTokenToLocal() {
    localStorage.setItem("GH_TOKEN", token);
    setToken(token);
    alert("Token saved to localStorage (demo only).");
  }

  // patch gist: update only the data file with new content
  async function saveToGist() {
    setError(null);

    // validate items is JSON serializable
    let payload;
    try {
      payload = JSON.stringify(players, null, 2);
    } catch (err) {
      setError("Failed to serialize JSON: " + err.message);
      return;
    }

    if (!token) {
      setError(
        "Missing GH_TOKEN (store a PAT in localStorage or use a server endpoint)"
      );
      return;
    }

    setSaving(true);
    try {
      const patchBody = {
        files: {
          [FILE_NAME]: { content: payload },
        },
      };

      const res = await fetch(GIST_API, {
        method: "PATCH",
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patchBody),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Gist patch failed ${res.status}: ${txt}`);
      }

      const updated = await res.json();
      // read back the file content to refresh state (paranoid)
      const file = updated.files && updated.files[FILE_NAME];
      if (!file) throw new Error("Updated gist missing file in response");
      const parsedBack = JSON.parse(file.content);
      setPlayers(
        Array.isArray(parsedBack) ? parsedBack : parsedBack.items ?? parsedBack
      );
      alert("Saved to gist successfully.");
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div style={{ padding: 16 }}>Loading…</div>;

  console.log("Players",players);

  return (
    <div className="app-container p-4">
      {error && (
        <div style={{ color: "crimson", marginBottom: 12 }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <PlayersCarousel
        players={players}
        updateItem={updateItem}
        removeRow={removeRow}
        load={load}
        addRow={addRow}
        saveToGist={saveToGist}
        saving={saving}
        error={error}
      />

    </div>
  );
}
