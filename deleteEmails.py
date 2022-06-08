import imaplib
import datetime
import sys

from datetime import date
from datetime import datetime, timedelta

print("Deleting mail")

d = datetime.today() - timedelta(days=7) 
dayNumber = d.day
dayStr = ""
if dayNumber<10:
    dayStr = "0" + dayNumber.__str__()
else:
    dayStr = dayNumber.__str__()


monthNumber = d.month

def num_to_month(*args, **kwargs):
    num = kwargs.get("num", None)

    if int(num) <= 12 and int(num) > 0:

        list_of_months = {'1': 'JAN', '2': 'FEB', '3': 'MAR',
                            '4': 'APR', '5': 'MAY', '6': 'JUN', '7': 'JUL',
                            '8': 'AUG', '9': 'SEP', '10': 'OCT',
                            '11': 'NOV', '12': 'DEC'}

        return list_of_months[num]

    else:
        print('num_to_month function error: "num=' + str(num) + '"')

month_from_num = num_to_month(num=str(monthNumber))

yearNumber = d.year

dateString = dayStr + "-" + month_from_num.__str__() + "-" + yearNumber.__str__()


my_email = sys.argv[1]
app_generated_password = sys.argv[2]

a = 'BEFORE \"' + dateString + '\"'

#initialize IMAP object for Gmail
imap = imaplib.IMAP4_SSL("imap.gmail.com")

#login to gmail with credentials
imap.login(my_email, app_generated_password)

imap.select("INBOX")

status, message_id_list = imap.search(None, a)

#convert the string ids to list of email ids
for num in message_id_list[0].split():
    imap.store(num, "+FLAGS", "\\Deleted")


print("Mail from " + a + " has been deleted")

# delete all the selected messages 
imap.expunge()
# close the mailbox
imap.close()

# logout from the account
imap.logout()
