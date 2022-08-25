export const shortenString = (str: string, n: any) => {
    return (str.length > n) ? str.slice(0, n-1) + '...' : str;
}
