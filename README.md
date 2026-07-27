# Skaylar
### Find what doesn't add up
Skaylar is a simple, web-based tool for forensic data analysis using Benford's Law to analyze and visualize first-digit distributions in a dataset. 
Paste the data, click Run Test, and instantly see if there are anomalies.

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