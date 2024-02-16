import eel
import bofh
from bs4 import BeautifulSoup
import requests
from os import stat

eel.init("web")

#koble til og log inn på cerebrum serveren
@eel.expose
def connect(url, Username, Password):
    try:
        global client
        client = bofh.connect(url=url)
        client.login(Username, Password)
        eel.go_to('index.html')
    except Exception as e:
        print(e)
@eel.expose
def searchbyName(name):
    userlist = []
    users = client.run_command('person_find', 'name', name)
    for index, user in enumerate(users):
        userInfo = list((user.get('account'), user.get('name')))
        userlist.append(userInfo)
        if index == 9:
          break
    return(userlist)

@eel.expose
def scrapeProfilePic(username):
    url = 'https://www.uia.no/kk/profil/' + username
    page = requests.get(url)
    soup = BeautifulSoup(page.text, 'html')
    img_data = requests.get(str(soup.find('img')).split('data-src=')[1].split()[0].strip('"')).content
    with open("web/assets/temp-pp.png", 'wb') as handler:
        handler.write(img_data)
    if stat("web/assets/temp-pp.png").st_size == 0:
        return(404)
    return(200)
    
        



@eel.expose
def accountSummary(username):
    summaryInfo = []

    personInfo = client.run_command('person_info', username)
    
    summaryInfo.append(personInfo[1].get('names'))
    summaryInfo.append(personInfo[10].get('prim_acc'))
    summaryInfo.append(personInfo[0].get('birth'))
    summaryInfo.append(personInfo[3].get('address_line_1'))
    summaryInfo.append(personInfo[4].get('address_city'))
    summaryInfo.append(personInfo[4].get('address_zip'))
    summaryInfo.append(personInfo[5].get('address_country'))
    summaryInfo.append(personInfo[7].get('contact'))
    summaryInfo.append(personInfo[8].get('contact'))
    summaryInfo.append(personInfo[11].get('prim_email'))
    summaryInfo.append(personInfo[9].get('employment_title'))
    summaryInfo.append(personInfo[0].get('affiliation_1'))
    summaryInfo.append((str(personInfo[0].get('last_seen_1')).strip("dateim()")))
    summaryInfo.append(client.user.history(username))
    
    
    return(summaryInfo)


eel.start("login.html")