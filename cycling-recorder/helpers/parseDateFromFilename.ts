export const parseDateFromFilename = (filename: string) => {
    const match = filename.match(
        /recording_(\d{2}-\d{2}-\d{4}_\d{2}:\d{2}:\d{2})\.json/
    );
    if (match) {
        const dateStr = match[1].replace(/_/g, " ");
        const [day, month, year, hour, minute, second] = dateStr.split(/[- :]/);
        const date = new Date(
            `${year}-${month}-${day}T${hour}:${minute}:${second}`
        );
        return date.toLocaleString(); // Format to a readable date and time string
    }
    return filename;
};
