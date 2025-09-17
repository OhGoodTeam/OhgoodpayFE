const callToken = async () => {
    const accessToken = sessionStorage.getItem("accessToken");
    return accessToken ? accessToken : null;
};
export default callToken;