//I might want to move my api auth request here from the user.js action file.

export async function testUser(username){
    return fetch("http://localhost:8081/unique/username",{
        method: "post",
        headers: {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        },
            body: JSON.stringify(username)
    }).then(res=>res.json()).catch(err=>err);

}
export async function testEmail(email){
    return fetch("http://localhost:8081/unique/username", {
        method: "post",
        headers: {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(email)
    })
}
