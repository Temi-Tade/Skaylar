# Skaylar
### Find what doesn't add up
Skaylar is a simple, web-based tool for forensic data analysis using Benford's Law to analyze and visualize first-digit distributions in a dataset. 
Paste the data, click Run Test, and instantly see if there are anomalies.

<img width="720" height="1264" alt="1001548566" src="https://github.com/user-attachments/assets/fe5a3655-4b7d-4c9a-8821-910684c53f58" />

> Benford's Law showing population of countries (1970, 1980, 1990, 2000, 2010, 2015, 2020, 2022)

---

## What is Benford's Law?
In real financial data, the digit "1" appears as the first digit ~30% of the time, "2" ~18%, etc.
If your data deviates too much, it can signal fraud, errors, or manipulation.
Skaylar checks this for you in seconds.

## How to Use
### 1. Visit the [website](https://temi-tade.github.io/Skaylar) or download the repo (offline use): 
`git clone https://github.com/Temi-Tade/Skaylar.git`  
or click `Code > Download ZIP` and extract files on your computer.

### 2. Open
Double-click `index.html` 
Works in Chrome, Edge, Firefox, and on mobile.

### 3. Analyze
1.  Paste your numbers in the box. Numbers should be delimited by commas, spaces or new lines
2.  Click `Run Test`
3.  View the results table and graph
4.  Click `Run Mock Data` to try it with sample data first

## What You Get
- **Results Table**: Expected % vs Actual % for digits 1-9 and deviations
- **Graph**: Visual comparison to spot deviations fast
- **Analytics**: Max deviation and Chi square value.

---

<img width="720" height="1307" alt="1001549146" src="https://github.com/user-attachments/assets/6bfd0660-b7c4-4b32-b2d4-4ee5ca07767f" />

> Height distribution (Does not follow Benford's Law)

<img width="720" height="1425" alt="1001548580" src="https://github.com/user-attachments/assets/6b5d9fb9-662d-4cba-9daa-b14e2b1d5583" />

> Fibonacci series (Follows Benford's Law)
