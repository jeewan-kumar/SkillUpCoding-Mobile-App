using System.Collections.Generic;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;

namespace COMMON_PROJECT_STRUCTURE_API.services
{
    public class skillup_UserSignUp
    {
        dbServices ds = new dbServices();
        public async Task<responseData> UserSignUp(requestData req)
        {
            responseData resData = new responseData();
            try
            {
                MySqlParameter[] myParam = new MySqlParameter[]
              {
                new MySqlParameter("@email",req.addInfo["email"].ToString()),
                new MySqlParameter("@phone_number",req.addInfo["phone_number"].ToString()),

              };
                var query = @"select * from pc_student.Skillup_UserSignUp where email=@email or phone_number=@phone_number ";
                //var query = @"select * from pc_student.Skillup_UserData where Emaill=@Emaill or PhoneNumber=@PhoneNumber ";

                var dbData = ds.executeSQL(query, myParam);
                if (dbData[0].Count() > 0)
                {
                    resData.rData["rMessage"] = "Duplicate Credentials";
                }
                else
                {
                    MySqlParameter[] insertParams = new MySqlParameter[]
                  {
                        //  new MySqlParameter("@Name", req.addInfo["Name"].ToString()),
                        new MySqlParameter("@phone_number", req.addInfo["phone_number"].ToString()),
                        new MySqlParameter("@password", req.addInfo["password"].ToString())  ,
                        new MySqlParameter("@email", req.addInfo["email"].ToString())
                  };
                    var sq = @"insert into pc_student.Skillup_UserSignUp(email,phone_number,password ) values(@email,@phone_number,@password)";

                    var insertResult = ds.ExecuteInsertAndGetLastId(sq, insertParams);
                    if (insertResult == null)
                    {
                        resData.rData["rCode"] = 1;
                        resData.rData["rMessage"] = "Registration Unsuccessful";
                    }
                    else
                    {
                        resData.rData["rCode"] = 0;
                        resData.rData["rMessage"] = "Registration Successful";
                        resData.rData["id"]=insertResult;
                    }

                }

            }
            catch (Exception ex)
            {
                resData.rData["rMessage"] = "An error occurred: " + ex.Message;
                throw;
            }
            return resData;
        }
        // public async Task<responseData> ForgotPassword(requestData req)
        // {
        //     responseData resData = new responseData();
        //     try
        //     {
        //         string identifier = req.addInfo.ContainsKey("email") ? req.addInfo["email"].ToString() : req.addInfo["phone_number"].ToString();
        //         string query = req.addInfo.ContainsKey("email") ?
        //             @"select * from pc_student.Skillup_UserSignUp where email=@identifier" :
        //             @"select * from pc_student.Skillup_UserSignUp where phone_number=@identifier";

        //         MySqlParameter[] myParam = new MySqlParameter[]
        //         {
        //             new MySqlParameter("@identifier", identifier)
        //         };

        //         var dbData = ds.executeSQL(query, myParam);
        //         if (dbData[0].Count() == 0)
        //         {
        //             resData.rData["rCode"] = 1;
        //             resData.rData["rMessage"] = "User not found";
        //         }
        //         else
        //         {
        //             string otp = GenerateOTP();
        //             DateTime otpExpiry = DateTime.UtcNow.AddMinutes(10); // OTP valid for 10 minutes

        //             // Save OTP and expiry time in database
        //             string saveOtpQuery = @"INSERT INTO pc_student.OtpVerification (identifier, otp, expiry_time) 
        //                                     VALUES (@identifier, @otp, @expiry_time)
        //                                     ON DUPLICATE KEY UPDATE otp = @otp, expiry_time = @expiry_time";
        //             MySqlParameter[] otpParams = new MySqlParameter[]
        //             {
        //                 new MySqlParameter("@identifier", identifier),
        //                 new MySqlParameter("@otp", otp),
        //                 new MySqlParameter("@expiry_time", otpExpiry)
        //             };

        //             ds.executeSQL(saveOtpQuery, otpParams);

        //             // Send OTP to user via email or SMS (implementation depends on your messaging service)
        //             SendOtp(identifier, otp);

        //             resData.rData["rCode"] = 0;
        //             resData.rData["rMessage"] = "OTP sent successfully";
        //         }
        //     }
        //     catch (Exception ex)
        //     {
        //         resData.rData["rMessage"] = "An error occurred: " + ex.Message;
        //         throw;
        //     }
        //     return resData;
        // }

        // private string GenerateOTP()
        // {
        //     Random random = new Random();
        //     return random.Next(100000, 999999).ToString();
        // }

        // private void SendOtp(string identifier, string otp)
        // {
        //     // Implement your email/SMS sending logic here
        //     // For example, using an email service or SMS gateway
        // }



        public async Task<responseData> ForgotPassword(requestData req)
        {
            responseData resData = new responseData();
            try
            {
                string query;
                MySqlParameter[] myParam;

                if (req.addInfo.ContainsKey("email"))
                {
                    myParam = new MySqlParameter[]
                    {
                new MySqlParameter("@identifier", req.addInfo["email"].ToString())
                    };
                    query = @"select * from pc_student.Skillup_UserSignUp where email=@identifier";
                }
                else if (req.addInfo.ContainsKey("phone_number"))
                {
                    myParam = new MySqlParameter[]
                    {
                new MySqlParameter("@identifier", req.addInfo["phone_number"].ToString())
                    };
                    query = @"select * from pc_student.Skillup_UserSignUp where phone_number=@identifier";
                }
                else
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "Email or phone number is required";
                    return resData;
                }

                var dbData = ds.executeSQL(query, myParam);
                if (dbData[0].Count() == 0)
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "User not found";
                }
                else
                {
                    // Generate OTP
                    string otp = GenerateOTP();
                    DateTime otpExpiration = DateTime.Now.AddMinutes(5);

                    // Update OTP in the database
                    MySqlParameter[] updateParams = new MySqlParameter[]
                    {
                new MySqlParameter("@identifier", req.addInfo.ContainsKey("email") ? req.addInfo["email"].ToString() : req.addInfo["phone_number"].ToString()),
                new MySqlParameter("@otp", otp),
                new MySqlParameter("@otp_expiration", otpExpiration)
                    };
                    string updateQuery = @"UPDATE pc_student.Skillup_UserSignUp
                                   SET otp = @otp, otp_expiration = @otp_expiration
                                   WHERE email = @identifier OR phone_number = @identifier";
                    ds.executeSQL(updateQuery, updateParams);

                    // Send OTP to user (email or SMS)
                    SendOTP(req.addInfo.ContainsKey("email") ? req.addInfo["email"].ToString() : req.addInfo["phone_number"].ToString(), otp);

                    resData.rData["rCode"] = 0;
                    resData.rData["rMessage"] = "OTP sent to your email/phone number";
                }
            }
            catch (Exception ex)
            {
                resData.rData["rMessage"] = "An error occurred: " + ex.Message;
                throw;
            }
            return resData;
        }

        // Method to generate OTP
        private string GenerateOTP()
        {
            Random rnd = new Random();
            return rnd.Next(100000, 999999).ToString();
        }

        // Method to send OTP (stub for sending email/SMS)
        private void SendOTP(string identifier, string otp)
        {
            // Logic to send OTP via email or SMS
        }


        public async Task<responseData> VerifyOtp(requestData req)
        {
            responseData resData = new responseData();
            try
            {
                if (req.addInfo == null)
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "Invalid request data";
                    return resData;
                }

                string identifier = req.addInfo.ContainsKey("email") ? req.addInfo["email"].ToString() : req.addInfo["phone_number"].ToString();
                string otp = req.addInfo.ContainsKey("otp") ? req.addInfo["otp"].ToString() : null;

                if (string.IsNullOrEmpty(otp))
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "OTP is required";
                    return resData;
                }

                string query = @"SELECT * FROM pc_student.Skillup_UserSignUp where email=@identifier AND otp=@otp AND otp_expiration > @current_time";
                MySqlParameter[] myParam = new MySqlParameter[]
                {
            new MySqlParameter("@identifier", identifier),
            new MySqlParameter("@otp", otp),
            new MySqlParameter("@current_time", DateTime.UtcNow)
                };

                // Assuming ds is an instance of your DataAccess class
                var dbData = ds.executeSQL(query, myParam);

                if (dbData == null || dbData.Count == 0 || dbData[0].Count == 0)
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "Invalid or expired OTP";
                }
                else
                {
                    resData.rData["rCode"] = 0;
                    resData.rData["rMessage"] = "OTP verified successfully";
                }
            }
            catch (Exception ex)
            {
                resData.rData["rMessage"] = "An error occurred: " + ex.Message;
                // Uncomment throw; if you want to propagate the exception
                // throw;
            }
            return resData;
        }
        public async Task<responseData> ResetPassword(requestData req)
        {
            responseData resData = new responseData();
            try
            {
                string query;
                MySqlParameter[] myParam;

                if (req.addInfo.ContainsKey("email"))
                {
                    myParam = new MySqlParameter[]
                    {
                new MySqlParameter("@identifier", req.addInfo["email"].ToString()),
                new MySqlParameter("@NewPassword", req.addInfo["password"].ToString())
                    };
                    query = @"SELECT * FROM pc_student.Skillup_UserSignUp
                      WHERE email = @identifier";
                }
                else if (req.addInfo.ContainsKey("phone_number"))
                {
                    myParam = new MySqlParameter[]
                    {
                new MySqlParameter("@identifier", req.addInfo["phone_number"].ToString()),
                new MySqlParameter("@NewPassword", req.addInfo["password"].ToString())
                    };
                    query = @"SELECT * FROM pc_student.Skillup_UserSignUp
                      WHERE phone_number = @identifier";
                }
                else
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "Email or phone number is required";
                    return resData;
                }

                var dbData = ds.executeSQL(query, myParam);
                if (dbData[0].Count() == 0)
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "User not found";
                }
                else
                {
                    MySqlParameter[] updateParams = new MySqlParameter[]
                    {
                new MySqlParameter("@identifier", req.addInfo.ContainsKey("email") ? req.addInfo["email"].ToString() : req.addInfo["phone_number"].ToString()),
                new MySqlParameter("@NewPassword", req.addInfo["password"].ToString())
                    };
                    string updateQuery = @"UPDATE pc_student.Skillup_UserSignUp
                                   SET password = @NewPassword
                                   WHERE email = @identifier OR phone_number = @identifier";
                    var updateResult = ds.executeSQL(updateQuery, updateParams);

                    if (updateResult[0].Count() == 0 && updateResult == null)
                    {
                        resData.rData["rCode"] = 1;
                        resData.rData["rMessage"] = "Password reset failed";
                    }
                    else
                    {
                        resData.rData["rCode"] = 0;
                        resData.rData["rMessage"] = "Password reset successful";
                    }
                }
            }
            catch (Exception ex)
            {
                resData.rData["rCode"] = 1;
                resData.rData["rMessage"] = "An error occurred: " + ex.Message;
            }
            return resData;
        }
        public async Task<responseData> ReadUserSignUp(requestData req)
        {
            responseData resData = new responseData();
            try
            {
                MySqlParameter[] Params = new MySqlParameter[]
              {
                        new MySqlParameter("@skillup_id", req.addInfo["skillup_id"]),
                       
              };
                var selectQuery = @"SELECT * FROM pc_student.Skillup_UserSignUp where skillup_id=@skillup_id";

                var selectResult = ds.executeSQL(selectQuery, Params);
                if (selectResult[0].Count() == 0)
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "No UserProfile found";
                }
                else
                {
                    resData.rData["rCode"] = 0;
                    resData.rData["rMessage"] = "Userprofile retrieved Successfully";
                    resData.rData["lessons"] = selectResult;
                }
            }
            catch (Exception ex)
            {
                resData.rData["rCode"] = 1;
                resData.rData["rMessage"] = "An error occurred: " + ex.Message;
            }
            return resData;
        }


    }
}



// public async Task<responseData> ResetPassword(requestData req)
// {
//     responseData resData = new responseData();
//     try
//     {
//         string identifier = req.addInfo.ContainsKey("email") ? req.addInfo["email"].ToString() : req.addInfo["phone_number"].ToString();
//         string newPassword = req.addInfo["NewPassword"].ToString();

//         string query = req.addInfo.ContainsKey("email") ?
//             @"UPDATE pc_student.Skillup_UserSignUp SET password=@NewPassword WHERE email=@identifier" :
//             @"UPDATE pc_student.Skillup_UserSignUp SET password=@NewPassword WHERE phone_number=@identifier";

//         MySqlParameter[] myParam = new MySqlParameter[]
//         {
//             new MySqlParameter("@identifier", identifier),
//             new MySqlParameter("@NewPassword", newPassword)
//         };

//         var updateResult = ds.executeSQL(query, myParam);
//         if (updateResult[0].Count() == 0)
//         {
//             resData.rData["rCode"] = 1;
//             resData.rData["rMessage"] = "Password reset successful";
//         }
//         else
//         {
//             resData.rData["rCode"] = 0;
//             resData.rData["rMessage"] = "Password reset failed";
//         }
//     }
//     catch (Exception ex)
//     {
//         resData.rData["rCode"] = 1;
//         resData.rData["rMessage"] = "An error occurred: " + ex.Message;
//     }
//     return resData;
// }