const NUMBERS = [];
const DIGITS = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const REPS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const FREQUENCY = {
    one: { frequency: 0, occurrence: 0 },
    two: { frequency: 0, occurrence: 0 },
    three: { frequency: 0, occurrence: 0 },
    four: { frequency: 0, occurrence: 0 },
    five: { frequency: 0, occurrence: 0 },
    six: { frequency: 0, occurrence: 0 },
    seven: { frequency: 0, occurrence: 0 },
    eight: { frequency: 0, occurrence: 0 },
    nine: { frequency: 0, occurrence: 0 }
};
const EXPECTED = [30.10, 17.61, 12.49, 9.69, 7.92, 6.69, 5.80, 5.12, 4.58];
const PARAMS = {
    startingValue: 90,
    currentValue: 0,
    growthRate: 10,
    runs: 7000,
    externalData : []
}

function init() {
    //NUMBERS.push(PARAMS.startingValue);
    PARAMS.currentValue = PARAMS.externalData.length > 0 ? PARAMS.externalData[0] : PARAMS.startingValue;
    
    starting.textContent = PARAMS.startingValue;
    current.textContent = PARAMS.currentValue;
    rate.textContent = `${PARAMS.growthRate}%`;
    size.textContent = PARAMS.externalData.length > 0 ? PARAMS.externalData.length : PARAMS.runs; 
    
    DIGITS.map((d, i) => {
        dist.innerHTML += `
            <tr>
                <td id='${d}'>${i+1}</td>
                <td id='${d}_freq'>0</td>
                <td id='${d}_occ'>0</td>
                <td id='${d}_exp'>${EXPECTED[i].toFixed(2)}</td>
            </tr>
        `;
    })
}

function testBenford(dataset) {
    if (dataset.length > 0) {
        updateCurrentValue();
    } else {
        const increase = (PARAMS.growthRate/100) * PARAMS.currentValue;
        updateCurrentValue(increase);
    }
}

function updateCurrentValue(val) {
    if (PARAMS.externalData.length > 0) {
        for (let d of PARAMS.externalData) {
            PARAMS.currentValue = d;
            
            NUMBERS.push(+PARAMS.currentValue);
            current.textContent = +PARAMS.currentValue.toFixed(2);
            
            const firstDigit = +PARAMS.currentValue.toString()[0];
            const id = DIGITS[REPS.indexOf(firstDigit)];
            log(id);
        }
    } else {
        PARAMS.currentValue += val;
        NUMBERS.push(+PARAMS.currentValue.toFixed(2));
        current.textContent = +PARAMS.currentValue.toFixed(2);
        
        const firstDigit = +PARAMS.currentValue.toString()[0];
        const id = DIGITS[REPS.indexOf(firstDigit)];
        log(id);
    }
}

function log(elementID) {
    FREQUENCY[elementID].frequency += 1;
    FREQUENCY[elementID].occurrence = ((FREQUENCY[elementID].frequency/(PARAMS.externalData.length > 0 ? PARAMS.externalData.length : NUMBERS.length)) * 100).toFixed(2);

    document.querySelector(`#${elementID}_freq`).textContent = FREQUENCY[elementID].frequency;
    document.querySelector(`#${elementID}_occ`).textContent = FREQUENCY[elementID].occurrence;
}

function plot(obj) {
    const isArray = Array.isArray(obj);
    const keys = isArray? obj.map((_, i) => i) : Object.keys(obj);
    const values = keys.map((k, i) => {
        const val = isArray? obj[k] : obj[k].occurrence;
        const x = (((i + 1) / 9) * 300).toFixed(2)
        const y = (300 - (val / 40) * 300).toFixed(2);

        return `${x} ${y}`;
    });
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M ${values[0]} C ${values.slice(1).join(' ')}`);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", obj[0] ? "#5555FF" : "#FF5555");
    path.setAttribute("stroke-width", "3");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    
    svg.appendChild(path)
}

function runTest() {
    plot(EXPECTED);
    performance.mark("start");

    const finish = () => {
      performance.mark("end"); // <-- moved here
      performance.measure('duration', 'start', 'end');
      
      duration.textContent = `Analysis completed in ${(performance.getEntriesByName('duration')[0].duration/1000).toFixed(2)}s`;
      form.style.display = "none";
      result.style.display = "block";
      
      performance.clearMarks();
      performance.clearMeasures();
    }
    
    if (PARAMS.externalData.length > 0) {
        //setTimeout(() => {
            testBenford(PARAMS.externalData);
            plot(FREQUENCY);
            finish();
        //});
    } else {
        let completed = 0;
        for (let i = 0; i < PARAMS.runs; i++) {
           // setTimeout(() => {
                testBenford(PARAMS.externalData);
                completed++;
                if (completed === PARAMS.runs) {
                    plot(FREQUENCY);
                    finish();
                }
           // }, 1000);
        }
    }
}

data.oninput = function(e) {
    const input = e.target.value.trim();
    const formattedInput = input.endsWith(",") ? input.substring(0, input.length - 1) : input;
    const arrayFromInput = formattedInput.split(/[,\s\n]+/).map(v => v.trim() === "" ? "" : +v);
    console.log(arrayFromInput)
    
    if (arrayFromInput.length > 0 && arrayFromInput[0] !== "") {
        runBtn.textContent = "Run Test";
        PARAMS.startingValue = arrayFromInput[0];
        PARAMS.externalData = arrayFromInput;
        PARAMS.growthRate = "-"
    } else {
        runBtn.textContent = "Run Test (Mock Data)";
    }
}

runBtn.onclick = function() {
    runBtn.textContent = "Running...";
    runBtn.disabled = true;
    init();
    runTest();
}