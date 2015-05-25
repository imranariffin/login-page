
function update_login()
{
	var username = document.getElementById('username').value;
	document.getElementById('current_username').innerHTML = username;
}

function login() 
{
	var input_username = document.getElementById('username').value;
	var input_password = document.getElementById('password').value;

	if (input_username=="imran" && input_password=="kunci")
	{
		location = "inside_page.html";
	}
}