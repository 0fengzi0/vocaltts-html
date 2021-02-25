class file {
    download (name, data) {
        let dataStr = 'data:audio/wav;base64,' + encodeURIComponent(data);
        let downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute('href', dataStr);
        downloadAnchorNode.setAttribute('download', name + '.wav');
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
}

export default new file();