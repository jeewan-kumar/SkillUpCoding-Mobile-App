
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;

namespace COMMON_PROJECT_STRUCTURE_API.services
{
    public class skillup_UserSignIn
    {
        dbServices ds = new dbServices();

        public async Task<responseData> UserSignIn(requestData rData)
        {
            responseData resData = new responseData();
            try
            {
                string query = "";
                MySqlParameter[] myParam;

                if (rData.addInfo.ContainsKey("email"))
                {
                    query = @"SELECT * FROM pc_student.Skillup_UserSignUp WHERE password = @password AND email = @email";
                    myParam = new MySqlParameter[]
                    {
                        new MySqlParameter("@password", rData.addInfo["password"]),
                        new MySqlParameter("@email", rData.addInfo["email"])
                    };
                }
                else if (rData.addInfo.ContainsKey("phone_number"))
                {
                    query = @"SELECT * FROM pc_student.Skillup_UserSignUp WHERE password = @password AND phone_number = @phone_number";
                    myParam = new MySqlParameter[]
                    {
                        new MySqlParameter("@password", rData.addInfo["password"]),
                        new MySqlParameter("@phone_number", rData.addInfo["phone_number"])
                    };
                }
                else
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "Email or Phone Number is required";
                    return resData;
                }

                var dbData = ds.ExecuteSQLName(query, myParam);
                if (dbData[0].Count() > 0)
                {
                    resData.rData["rCode"] = 0;
                    resData.rData["rMessage"] = "Login Successful";
                    resData.rData["id"]=dbData[0][0]["skillup_id"];

                     // Create a new session token
                    string token = Guid.NewGuid().ToString();
                    MySqlParameter[] sessionParams = new MySqlParameter[]
                    {
                        new MySqlParameter("@skillup_id", dbData[0][0]["skillup_id"]),
                        new MySqlParameter("@token", token)
                    };
                    string sessionQuery = @"INSERT INTO pc_student.Skillup_Sessions (skillup_id, token) VALUES (@skillup_id, @token)";
                    ds.ExecuteSQLName(sessionQuery, sessionParams);
                    
                    resData.rData["token"] = token;
                }
                else
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "Invalid Email/Phone Number and Password";
                }
            }
            catch (Exception ex)
            {
                resData.rData["rCode"] = 1;
                resData.rData["rMessage"] = "Error: " + ex.Message;
            }
            return resData;
        }
         public async Task<responseData> UserLogout(requestData rData)
        {
            responseData resData = new responseData();
            try
            {
                if (!rData.addInfo.ContainsKey("token"))
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "Token is required for logout";
                    return resData;
                }

                string query = @"DELETE FROM pc_student.Skillup_Sessions WHERE token = @token";
                MySqlParameter[] myParam = new MySqlParameter[]
                {
                    new MySqlParameter("@token", rData.addInfo["token"])
                };

                var dbData = ds.ExecuteSQLName(query, myParam);
                if (dbData!=null )
                {
                    resData.rData["rCode"] = 0;
                    resData.rData["rMessage"] = "Logout Successful";
                }
                else
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "Invalid Token";
                }
            }
            catch (Exception ex)
            {
                resData.rData["rCode"] = 1;
                resData.rData["rMessage"] = "Error: " + ex.Message;
            }
            return resData;
        }
        
    }
}
