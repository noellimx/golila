




const getLoginPage = () => {
  const wrap = document.createElement("div")

  const username = document.createElement("input")
  username.setAttribute("type","text")
  const password = document.createElement("input")
  password.setAttribute("type", "text")
wrap.replaceChildren(username,password)
  return wrap;

}


const loginPage = getLoginPage()


export default loginPage