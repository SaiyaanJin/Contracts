from cmath import nan
import os
from pymongo import MongoClient, ASCENDING, DESCENDING, errors
from datetime import date, timedelta, datetime, timezone
from flask import Flask, jsonify, request, redirect, Response, send_file, send_from_directory
from flask_cors import CORS
import json

from werkzeug .utils import secure_filename
import zipfile
from exchangelib import Credentials, Account, Configuration, DELEGATE, Message, Mailbox, FileAttachment, HTMLBody

app = Flask(__name__)

CORS(app)

def ContractsCollection():

    # CONNECTION_STRING = "mongodb://forecast_user:forecast@10.3.101.90:27017/?authSource=admin"
    CONNECTION_STRING = "mongodb://mongodb0.erldc.in:27017,mongodb1.erldc.in:27017/?replicaSet=CONSERV"
    client = MongoClient(CONNECTION_STRING)
    db = client['contracts']
    db1 = client['Assets']
    it_erldc_assets = db1['IT_ERLDC_Assets']
    it_erldc_contracts = db['IT_ERLDC']
    Contracts_Table = db['Contracts_Data']
    # Contracts_Table.create_index(
    #     [("Contract_Reference_No", ASCENDING)],
    #     unique=True
    # )

    return Contracts_Table, it_erldc_assets


Contracts_Table, it_erldc_assets = ContractsCollection()


def service_mail(data_list):

    credentials = Credentials('nldc\\erldcnotifications', 'Tfpsdmp@2023')
    config = Configuration(
        server='mail.grid-india.in', credentials=credentials)
    account = Account(primary_smtp_address='erldcnotifications@grid-india.in', config=config,
                      autodiscover=False, access_type=DELEGATE)

    dept = [
        ["Human Resource"],
        ["Contracts & Services"],
        ["Finance & Accounts"],
        ["System Operation"],
        ["Market Operation"],
        ["Technical Services"],
        ["Information Technology"],
        ["Communication"],
        ["SCADA"]]

    email_address_list = [["erldchr.gr@grid-india.in", "varshabyahut@grid-india.in", ["rosysinha@grid-india.in"]],
                          ["erldc.cs@grid-india.in", ["sukumar@grid-india.in"]],
                          ["mdas@grid-india.in", "jatan@grid-india.in",
                           "sumit.prasad@grid-india.in", "diptikanta@grid-india.in", ["vivek.upadhyay@grid-india.in"]],
                          #   ["ciso-erldc@grid-india.in", ["mviswanadh@grid-india.in",
                          #                                 "paul.tapobrata@grid-india.in"]],
                          ["erldcso@grid-india.in", ["konar_s@grid-india.in",
                                                     "bilas.achari@grid-india.in", "manasdas@grid-india.in"]],
                          ["erldc.mo@grid-india.in",
                           ["saurav.sahay@grid-india.in"]],
                          ["sujitnandi@grid-india.in",
                           "avijitroy@grid-india.in", ["scde@grid-india.in", "mkmallick@grid-india.in"]],
                          ["erldcitgr@grid-india.in", ["gurmit@grid-india.in",
                                                       "paul.tapobrata@grid-india.in"]],
                          ["erldccommunication@grid-india.in",
                           ["scde@grid-india.in", "lmuralikrishna@grid-india.in"]],
                          ["erldcscada@grid-india.in", ["scde@grid-india.in", "dbiswas@grid-india.in"]]]

    if data_list[0] == "New Contracts Input":

        for index in range(len(dept)):
            if (data_list[1] in dept[index]):
                m = Message(
                    account=account,
                    subject=data_list[0]+": "+data_list[3],
                    body='',
                    to_recipients=email_address_list[index][:-1],
                    cc_recipients=email_address_list[index][-1])

                html_body = """
                            <html>
                                <body>
                                Sir/Madam,<br/>
                                    A new contract's entry was made for: <b>{}</b>, with name- <b>{}</b>.<br/>
                                    The Seller name is- <b>{}</b> and the Engineer in-charge of this contract is- <b>{}</b><br/> 
                                    Kindly check the contract's details from Contracts portal <b><a href="https://sso.erldc.in:3000">sso login</a></b>.<br/>
                                    This entry is made by {}.<br/><br/>

                                <h5>This is a system generated mail. Please do not reply to this mail.</h5><br/>
                                </body>
                            </html>
                """

                m.body = HTMLBody(html_body.format(
                    data_list[1], data_list[3], data_list[4], data_list[5], data_list[2]))
                m.send()

    elif data_list[0] == "Contract Expiry":

        try:

            for index in range(len(dept)):
                if (data_list[1]["Intending_Department"] in dept[index]):
                    m = Message(
                        account=account,
                        subject="Attention: " +
                        data_list[1]["Contract_Name"] +
                        " contract is going to Expire on (" +
                        data_list[1]["Contract_End_Date"]+")",
                        body='',
                        to_recipients=email_address_list[index][:-1],
                        cc_recipients=email_address_list[index][-1])

                    html_body = """
                                <html>
                                    <body>
                                    Sir/Madam,<br/>
                                        <b>{}</b> contract is about to expire on <b>{}</b>, the details of the contract is:-<br/>
                                        1. Intending Department: <b>{}</b>.<br/>
                                        2. Contract Name: <b>{}</b>.<br/>
                                        3. Short Description: <b>{}</b>.<br/>
                                        4. Seller Name: <b>{}</b>.<br/>
                                        5. Contract Type: <b>{}</b>.<br/>
                                        6. Contract Reference No: <b>{}</b>.<br/>
                                        7. Engineer in-charge: <b>{}</b>.<br/>
                                        8. Contract Value: ₹ <b>{}</b>.<br/>
                                        9. Contract Period: <b>{}</b>.<br/>
                                        10. Contract_Award_Date: <b>{}</b>.<br/>
                                        11. Contract Start Date: <b>{}</b>.<br/>
                                        12. Contract End Date: <b>{}</b>.<br/>
                                        
                                        Kindly check the contract's details from Contracts portal <b><a href="https://sso.erldc.in:3000">sso login</a></b>.<br/>
                                        

                                    <h5>This is a system generated mail. Please do not reply to this mail.</h5><br/>
                                    </body>
                                </html>
                    """

                    m.body = HTMLBody(html_body.format(
                        data_list[1]["Contract_Name"],
                        data_list[1]["Contract_End_Date"],
                        data_list[1]["Intending_Department"],
                        data_list[1]["Contract_Name"],
                        data_list[1]["Short_Description"],
                        data_list[1]["Seller_Name"],
                        data_list[1]["Contract_Type"],
                        data_list[1]["Contract_Reference_No"],
                        data_list[1]["E_I_C"],
                        data_list[1]["Contract_Value"],
                        data_list[1]["Contract_Period"],
                        data_list[1]["Contract_Award_Date"],
                        data_list[1]["Contract_Start_Date"],
                        data_list[1]["Contract_End_Date"]
                    ))
                    m.send()

                    return ("Sent")

        except:
            return ("failed")

    elif data_list[0] == "Contract Expiry(Reminder)":

        try:

            for index in range(len(dept)):
                if (data_list[1]["Intending_Department"] in dept[index]):
                    m = Message(
                        account=account,
                        subject="(Reminder)Attention: "+data_list[1]["Contract_Name"] +
                        " contract is going to Expire on (" +
                        data_list[1]["Contract_End_Date"]+")",
                        body='',
                        to_recipients=email_address_list[index][:-1],
                        cc_recipients=email_address_list[index][-1])

                    html_body = """
                                <html>
                                    <body>
                                    Sir/Madam,<br/>
                                        <b>{}</b> contract is about to expire on <b>{}</b>, the details of the contract is:-<br/>
                                        1. Intending Department: <b>{}</b>.<br/>
                                        2. Contract Name: <b>{}</b>.<br/>
                                        3. Short Description: <b>{}</b>.<br/>
                                        4. Seller Name: <b>{}</b>.<br/>
                                        5. Contract Type: <b>{}</b>.<br/>
                                        6. Contract Reference No: <b>{}</b>.<br/>
                                        7. Engineer in-charge: <b>{}</b>.<br/>
                                        8. Contract Value: ₹ <b>{}</b>.<br/>
                                        9. Contract Period: <b>{}</b>.<br/>
                                        10. Contract_Award_Date: <b>{}</b>.<br/>
                                        11. Contract Start Date: <b>{}</b>.<br/>
                                        12. Contract End Date: <b>{}</b>.<br/>
                                        
                                        Kindly check the contract's details from Service request portal <b><a href="https://sso.erldc.in:3000">sso login</a></b>.<br/>
                                        

                                    <h5>This is a system generated mail. Please do not reply to this mail.</h5><br/>
                                    </body>
                                </html>
                    """

                    m.body = HTMLBody(html_body.format(
                        data_list[1]["Contract_Name"],
                        data_list[1]["Contract_End_Date"],
                        data_list[1]["Intending_Department"],
                        data_list[1]["Contract_Name"],
                        data_list[1]["Short_Description"],
                        data_list[1]["Seller_Name"],
                        data_list[1]["Contract_Type"],
                        data_list[1]["Contract_Reference_No"],
                        data_list[1]["E_I_C"],
                        data_list[1]["Contract_Value"],
                        data_list[1]["Contract_Period"],
                        data_list[1]["Contract_Award_Date"],
                        data_list[1]["Contract_Start_Date"],
                        data_list[1]["Contract_End_Date"]
                    ))

                    m.send()

                    return ("Sent")

        except:
            return ("failed")

    elif data_list[0] == "Contract Expired":

        try:

            for index in range(len(dept)):
                if (data_list[1]["Intending_Department"] in dept[index]):
                    m = Message(
                        account=account,
                        subject="Attention: "+data_list[1]["Contract_Name"] +
                        " contract is Expired on (" +
                        data_list[1]["Contract_End_Date"]+")",
                        body='',
                        to_recipients=email_address_list[index][:-1],
                        cc_recipients=email_address_list[index][-1])

                    html_body = """
                                <html>
                                    <body>
                                    Sir/Madam,<br/>
                                        <b>{}</b> contract is expired on <b>{}</b>, the details of the contract is:-<br/>
                                        1. Intending Department: <b>{}</b>.<br/>
                                        2. Contract Name: <b>{}</b>.<br/>
                                        3. Short Description: <b>{}</b>.<br/>
                                        4. Seller Name: <b>{}</b>.<br/>
                                        5. Contract Type: <b>{}</b>.<br/>
                                        6. Contract Reference No: <b>{}</b>.<br/>
                                        7. Engineer in-charge: <b>{}</b>.<br/>
                                        8. Contract Value: ₹ <b>{}</b>.<br/>
                                        9. Contract Period: <b>{}</b>.<br/>
                                        10. Contract_Award_Date: <b>{}</b>.<br/>
                                        11. Contract Start Date: <b>{}</b>.<br/>
                                        12. Contract End Date: <b>{}</b>.<br/>
                                        
                                        Kindly check the contract's details from Service request portal <b><a href="https://sso.erldc.in:3000">sso login</a></b>.<br/>
                                        

                                    <h5>This is a system generated mail. Please do not reply to this mail.</h5><br/>
                                    </body>
                                </html>
                    """

                    m.body = HTMLBody(html_body.format(
                        data_list[1]["Contract_Name"],
                        data_list[1]["Contract_End_Date"],
                        data_list[1]["Intending_Department"],
                        data_list[1]["Contract_Name"],
                        data_list[1]["Short_Description"],
                        data_list[1]["Seller_Name"],
                        data_list[1]["Contract_Type"],
                        data_list[1]["Contract_Reference_No"],
                        data_list[1]["E_I_C"],
                        data_list[1]["Contract_Value"],
                        data_list[1]["Contract_Period"],
                        data_list[1]["Contract_Award_Date"],
                        data_list[1]["Contract_Start_Date"],
                        data_list[1]["Contract_End_Date"]
                    ))

                    m.send()

                    return ("Sent")

        except:
            return ("failed")


@app.route('/getcontractsData', methods=['GET', 'POST'])
def getcontractsData():
    department = request.args['Department']
    admin = request.args['Admin']

    if (admin == "false"):

        result = list(Contracts_Table.find(
            filter={'Intending_Department': department}, projection={'_id': 0}))

        result = sorted(
            result, key=lambda x: x["Entry_No"], reverse=True)

        for i in range(len(result)):

            today = datetime.strptime(
                datetime.today().strftime('%d-%m-%Y'), "%d-%m-%Y")

            contract_end_date = datetime.strptime(
                result[i]["Contract_End_Date"], "%d-%m-%Y")

            if (contract_end_date-today).days/30 < 4 and (contract_end_date-today).days/30 > 0:

                if result[i]["Expired_Mail_Sent"] == "No":
                    response = service_mail(["Contract Expiry", result[i]])

                    if response == "Sent":
                        result[i]["Expired_Mail_Sent"] = "Yes " + \
                            datetime.today().strftime('%d-%m-%Y')

                        result[i]["Type"] = "About to Expire"

                        Contracts_Table.update_one(
                            {"Contract_Reference_No": result[i]["Contract_Reference_No"]}, {"$set": result[i]})

                else:
                    last_sent = datetime.strptime(
                        (result[i]["Expired_Mail_Sent"]).split(" ")[1], "%d-%m-%Y")

                    if (today - last_sent).days > 29:
                        response = service_mail(
                            ["Contract Expiry(Reminder)", result[i]])

                        if response == "Sent":
                            result[i]["Expired_Mail_Sent"] = "Yes " + \
                                datetime.today().strftime('%d-%m-%Y')

                            result[i]["Type"] = "About to Expire"

                            Contracts_Table.update_one(
                                {"Contract_Reference_No": result[i]["Contract_Reference_No"]}, {"$set": result[i]})

            elif (contract_end_date-today).days < 0:

                if result[i]["Expired_Mail_Sent"] != "No":

                    last_sent = datetime.strptime(
                        (result[i]["Expired_Mail_Sent"]).split(" ")[1], "%d-%m-%Y")

                    if (last_sent - contract_end_date).days < 0:
                        response = service_mail(
                            ["Contract Expired", result[i]])

                        if response == "Sent":
                            result[i]["Expired_Mail_Sent"] = "Yes " + \
                                datetime.today().strftime('%d-%m-%Y')

                            result[i]["Type"] = "Expired"

                            Contracts_Table.update_one(
                                {"Contract_Reference_No": result[i]["Contract_Reference_No"]}, {"$set": result[i]})

                else:

                    response = service_mail(["Contract Expired", result[i]])

                    if response == "Sent":
                        result[i]["Expired_Mail_Sent"] = "Yes " + \
                            datetime.today().strftime('%d-%m-%Y')

                        result[i]["Type"] = "Expired"

                        Contracts_Table.update_one(
                            {"Contract_Reference_No": result[i]["Contract_Reference_No"]}, {"$set": result[i]})

            try:
                result[i].pop("Data_Entered_By")
            except:
                pass

        def get_index(element):
            return sort_order.index(element['Type'])

        sort_order = ["About to Expire", "Active", "Expired"]

        result = sorted(result, key=get_index)

        for i in range(len(result)):

            result[i]["Short_Description"] = str(
                result[i]["Short_Description"])
            result[i]["Intending_Department"] = str(
                result[i]["Intending_Department"])
            result[i]["Contract_Name"] = str(result[i]["Contract_Name"])
            result[i]["Contract_Award_Date"] = str(
                result[i]["Contract_Award_Date"])
            result[i]["Seller_Name"] = str(result[i]["Seller_Name"])
            result[i]["Contract_Type"] = str(result[i]["Contract_Type"])
            result[i]["Contract_Period"] = str(result[i]["Contract_Period"])
            result[i]["Contract_Start_Date"] = str(
                result[i]["Contract_Start_Date"])
            result[i]["Contract_End_Date"] = str(
                result[i]["Contract_End_Date"])
            result[i]["Contract_Reference_No"] = str(
                result[i]["Contract_Reference_No"])
            result[i]["Contract_Platform"] = str(
                result[i]["Contract_Platform"])
            result[i]["E_I_C"] = str(result[i]["E_I_C"])

        return jsonify(result)

    elif (admin == "true"):

        project = {'_id': 0}

        result = list(Contracts_Table.find(projection=project))

        result = sorted(
            result, key=lambda x: x["Entry_No"], reverse=True)

        for i in range(len(result)):
            try:
                result[i].pop("Data_Entered_By")
            except:
                pass
        return jsonify(result)

    else:
        return jsonify("Error")


@app.route('/contracts_insert', methods=['GET', 'POST'])
def contracts_insert():
    datas = request.headers['datas']
    datas = json.loads(datas)
    try:
        Entry_No = Contracts_Table.find_one(sort=[("Entry_No", -1)])

        datas["Entry_No"] = int(Entry_No["Entry_No"])+1

        res = Contracts_Table.insert_one(datas)

        service_mail(["New Contracts Input", datas["Intending_Department"],
                     datas["Data_Entered_By"], datas["Contract_Name"], datas["Seller_Name"], datas["E_I_C"]])

        return jsonify(["Data Inserted Successfully", datas["Entry_No"]])
    except errors.DuplicateKeyError as d:
        return jsonify("Duplicate Data")
    except:
        return jsonify("Please Submit Meaning Data")


@app.route('/Contractsupdate', methods=['GET', 'POST'])
def Contractsupdate():

    datas = request.headers['datas']
    datas = json.loads(datas)

    try:

        Contracts_Table.update_one(
            {"Contract_Reference_No": datas["Contract_Reference_No"]}, {"$set": datas})

        reply = "Success"

    except:
        reply = "Error"

    return jsonify(reply)


@app.route('/upload', methods=['GET', 'POST'])
def upload():

    file = request.files.getlist("demo[]")
    entry = request.args['entry']

    if file:

        # for item in file:

        # name = item.filename
        # name = name.replace(" ", "_")
        # name = name.replace(")", "")
        # name = name.replace("(", "")
        # filepath = filepath+name

        filepath = 'Uploaded_Files'

        i = 0
        for item in file:
            i += 1
            name = "File_"+entry+str(i)+"."+(item.filename).split(".")[-1]
            os.makedirs(os.path.join(
                'D:/Applications/Contracts/contracts_fe/public', filepath), exist_ok=True)
            item.save(os.path.join('D:/Applications/Contracts/contracts_fe/public', filepath,
                      secure_filename(name)))
    return ("Done")


@app.route('/download', methods=['GET', 'POST'])
def download():

    File_list = request.args['File_Name']

    File_list = File_list.split(',')

    all_files = []
    filepath = ""

    # for file1 in File_list:
    #     file1 = file1.replace(" ", "_")
    #     file1 = file1.replace(")", "")
    #     file1 = file1.replace("(", "")
    #     filepath = filepath+file1

    folder_path = "D:/Applications/Contracts/contracts_fe/public/Uploaded_Files/"

    dir_list = os.listdir(folder_path)

    with zipfile.ZipFile("D:/Applications/Contracts/contracts_be/instance/ZipFiles/output.zip", "w") as archive:

        for file in File_list:

            # file = file.replace(" ", "_")
            # file = file.replace(")", "")
            # file = file.replace("(", "")
            # file = file.replace("&", "")

            if file in dir_list:

                file_path = folder_path+file
                # print(file_path)
                all_files.append(file_path)

                archive.write(file_path)
                # archive.write("file2.txt")

            else:
                return jsonify(file+" has been removed")

    # archived = shutil.make_archive(
    #     "D:/test/Contracts/contracts_be/instance/ZipFiles/testzip", 'zip', folder_path)

    return send_file('D:/Applications/Contracts/contracts_be/instance/ZipFiles/output.zip', as_attachment=True, download_name="dwn.zip")


# @app.route('/file_view', methods=['GET', 'POST'])
# def file_view():

#     File_list = request.args['File_Name']

#     File_list = File_list.split(',')

#     all_files = []
#     filepath = ""

#     for file1 in File_list:
#         file1 = file1.replace(" ", "_")
#         file1 = file1.replace(")", "")
#         file1 = file1.replace("(", "")
#         file = file.replace(",", "")
#         filepath = filepath+file1

#     folder_path = "D:/test/Contracts/contracts_be/instance/htmlfi/"+filepath

#     for file in File_list:

#         if file.split(".")[-1] == "pdf":

#             file = file.replace(" ", "_")
#             file = file.replace(")", "")
#             file = file.replace("(", "")
#             file = file.replace("&", "")
#             file = file.replace(",", "_")

#             return jsonify(file)
#         else:
#             return ("None")


@app.route('/delete', methods=['GET', 'POST'])
def delete():

    datas = request.headers['datas']
    datas = json.loads(datas)

    try:

        Contracts_Table.delete_one(
            {"Contract_Reference_No": datas["Contract_Reference_No"]})

        reply = "Success"

    except:
        reply = "Error"

    return jsonify(reply)


@app.route('/dashboard', methods=['GET', 'POST'])
def dashboard():

    dept = [
        "System Operation",
        "Market Operation",
        "SCADA",
        "Communication",
        "Information Technology",
        "Technical Services",
        "Finance & Accounts",
        "Human Resource",
        "Contracts & Services"
    ]

    department_data = []
    final_output = []

    for item in dept:

        try:

            response = Contracts_Table.find(
                filter={'Intending_Department': item}, projection={'_id': 0, 'Type': 1, 'Intending_Department': 1})

            response = list(response)

            if (len(response) > 0):
                department_data.append(response)

        except:
            continue

    for item1 in department_data:

        active = 0
        about_to_expire = 0
        expired = 0

        for thing in item1:
            if thing["Type"] == "Active":
                active += 1

            if thing["Type"] == "Expired":
                expired += 1

            if thing["Type"] == "About to Expire":
                about_to_expire += 1

        temp_dict = {
            "Department": item1[0]["Intending_Department"],
            "Total": len(item1),
            "Active": active,
            "Expired": expired,
            "About_To_Expire": about_to_expire}

        final_output.append(temp_dict)

    final_output = sorted(final_output, key=lambda x: x["Total"], reverse=True)

    return jsonify(final_output)


@app.route('/delete_boq', methods=['GET', 'POST'])
def delete_boq():

    file = request.args['File_Name']

    response = Contracts_Table.find(
        filter={'BOQ_File_Name': {'$in': [file]}}, projection={'_id': 0})

    response_list = list(response)

    Entry_No = response_list[0]['Entry_No']
    BOQ_File_Name = response_list[0]['BOQ_File_Name']

    index = BOQ_File_Name.index(file)
    BOQ_File_Name.pop(index)

    response_dict = response_list[0]

    response_dict['BOQ_File_Name'] = BOQ_File_Name

    try:

        Contracts_Table.update_one(
            {"Entry_No": Entry_No}, {"$set": response_dict})

        os.remove('D:/Applications/Contracts/contracts_fe/public/Uploaded_Files/'+file)

        return jsonify("done")

    except:
        return jsonify("failed")


if __name__ == '__main__':

    app.run(debug=True, host='0.0.0.0', port=5011)
