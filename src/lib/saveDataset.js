export default function saveDataset(data) {
    return (`
        <h3>Save Dataset</h3>
        <form id="saveForm" autocomplete="off">
            <div>
                <input type="text" placeholder="Dataset Name" id="dataset_name" required/>
            </div>
            
            <div>
                <input type="text" placeholder="Description" id="dataset_description" required/> 
            </div>
            
            <div>
                <input type="text" placeholder="Dataset Source" id="dataset_source" required/>
            </div>
            
            <div>
                <textarea rows="8" cols="40" readonly>${data}</textarea>
            </div>
            
            <div>
                <button type="submit">Save Dataset as JSON</button>
            </div>
        </form>
    `);
}