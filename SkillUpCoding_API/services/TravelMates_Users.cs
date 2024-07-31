using System;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;

namespace TravelMate_Api.services
{
    public class TravelMates_Users
    {
        dbServices ds = new dbServices();

        public async Task<responseData> TravelMates_UserSignUp(requestData req)
        {
            responseData resData = new responseData();
            try
            {
                MySqlParameter[] myParam = new MySqlParameter[]
                {
                    new MySqlParameter("@phone_number", req.addInfo["phone_number"].ToString()),
                    new MySqlParameter("@email", req.addInfo["email"].ToString())
                };

                var query = @"SELECT * FROM pc_student.TravelMates_Users WHERE email=@email OR phone_number=@phone_number";
                var dbData = ds.executeSQL(query, myParam);

                if (dbData[0].Count > 0 && dbData[0] != null)
                {
                    resData.rData["rMessage"] = "Duplicate Credentials";
                }
                else
                {
                    // Generate OTP for phone and email
                    string phoneOtp = GenerateOTP();
                    string emailOtp = GenerateOTP();

                    // Send OTP to phone and email
                    await SendOTPToPhone(req.addInfo["phone_number"].ToString(), phoneOtp);
                    await SendOTPToEmail(req.addInfo["email"].ToString(), emailOtp);

                    // Store OTP in respective tables
                    StorePhoneOTP(req.addInfo["phone_number"].ToString(), phoneOtp);
                    StoreEmailOTP(req.addInfo["email"].ToString(), emailOtp);

                    // Temporarily store user details until OTP verification
                    MySqlParameter[] insertParams = new MySqlParameter[]
                    {
                        new MySqlParameter("@full_name", req.addInfo["full_name"].ToString()),
                        new MySqlParameter("@phone_number", req.addInfo["phone_number"].ToString()),
                        new MySqlParameter("@email", req.addInfo["email"].ToString()),
                        new MySqlParameter("@date_of_birth", req.addInfo["date_of_birth"].ToString()),
                        new MySqlParameter("@password", req.addInfo["password"].ToString()),
                        new MySqlParameter("@phone_verified", false),
                        new MySqlParameter("@email_verified", false)
                    };

                    var sq = @"INSERT INTO pc_student.TravelMates_Users 
                                (full_name, email, phone_number, date_of_birth, password, phone_verified, email_verified) 
                                VALUES (@full_name, @email, @phone_number, @date_of_birth, @password, @phone_verified, @email_verified)";

                    var insertResult = ds.ExecuteInsertAndGetLastId(sq, insertParams);

                    if (insertResult == null)
                    {
                        resData.rData["rCode"] = 1;
                        resData.rData["rMessage"] = "Registration Unsuccessful";
                    }
                    else
                    {
                        resData.rData["rCode"] = 0;
                        resData.rData["rMessage"] = "Registration Successful. Please verify your phone and email.";
                        resData.rData["id"] = insertResult;
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

        private string GenerateOTP()
        {
            Random rand = new Random();
            return rand.Next(100000, 999999).ToString();
        }

        private async Task SendOTPToPhone(string phoneNumber, string phoneOtp)
        {
            // Logic to send OTP to phone (Example: Using Twilio)
            // Replace this with actual implementation
            Console.WriteLine($"Sending OTP {phoneOtp} to {phoneNumber}");
            // await Twilio logic here
        }

        private async Task SendOTPToEmail(string email, string emailOtp)
        {
            // Logic to send OTP to email (Example: Using SMTP)
            // Replace this with actual implementation
            Console.WriteLine($"Sending OTP {emailOtp} to {email}");
            // await SMTP logic here
        }

        private void StorePhoneOTP(string phoneNumber, string phoneOtp)
        {
            MySqlParameter[] otpParams = new MySqlParameter[]
            {
                new MySqlParameter("@phone_number", phoneNumber),
                new MySqlParameter("@phone_otp", phoneOtp),
                new MySqlParameter("@expires_at", DateTime.Now.AddMinutes(10)) // OTP expires in 10 minutes
            };

            var otpQuery = @"INSERT INTO pc_student.TravelMates_PhoneOTP (phone_number, phone_otp, expires_at) VALUES (@phone_number, @phone_otp, @expires_at)";
            ds.ExecuteInsertAndGetLastId(otpQuery, otpParams);
        }

        private void StoreEmailOTP(string email, string emailOtp)
        {
            MySqlParameter[] otpParams = new MySqlParameter[]
            {
                new MySqlParameter("@email", email),
                new MySqlParameter("@email_otp", emailOtp),
                new MySqlParameter("@expires_at", DateTime.Now.AddMinutes(10)) // OTP expires in 10 minutes
            };

            var otpQuery = @"INSERT INTO pc_student.TravelMates_EmailOTP (email, email_otp, expires_at) VALUES (@email, @email_otp, @expires_at)";
            ds.ExecuteInsertAndGetLastId(otpQuery, otpParams);
        }
    }
}
