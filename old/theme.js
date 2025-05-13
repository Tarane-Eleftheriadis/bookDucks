const getDisplayColor = async () => {
    const response = await axios.get(`${baseUrl}/api/display-color`);
    const data = response.data;
    console.log(data);

    const colorTheme = data.data.colorTheme;
    console.log(colorTheme);

    document.body.classList.add(colorTheme);
};
  
getDisplayColor();