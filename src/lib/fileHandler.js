export default function handleFileUpload() {
    return (`
        <div class='uploader'>
            <label for='fileInput'>
                <input type='file' id='fileInput' accept=".json"/>
                <span><i data-lucide="upload" width="14"></i> &nbsp;Upload a JSON Dataset file</span>
            </label>
        </div>
    `);
}