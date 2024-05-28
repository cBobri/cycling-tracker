export const formatDateTime = (date: Date) => {
    const pad = (n: number) => (n < 10 ? "0" + n : n);
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hour = pad(date.getHours());
    const minute = pad(date.getMinutes());
    const second = pad(date.getSeconds());

    return `${day}-${month}-${year}_${hour}:${minute}:${second}`;
};
