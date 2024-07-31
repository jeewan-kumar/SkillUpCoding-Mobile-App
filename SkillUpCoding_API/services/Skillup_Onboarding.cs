using System.Collections.Generic;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;

namespace COMMON_PROJECT_STRUCTURE_API.services
{
    public class Skillup_Onboarding
    {
        dbServices ds = new dbServices();

        public async Task<responseData> InsertData(requestData req)
        {
            responseData resData = new responseData();
            try
            {
                byte[] imageData = null;

                if (req.addInfo.ContainsKey("image"))
                {
                    var filePath = req.addInfo["image"].ToString();
                    imageData = File.ReadAllBytes(filePath);
                }

                MySqlParameter[] insertParams = new MySqlParameter[]
                {
                    new MySqlParameter("@image", MySqlDbType.Blob) { Value = imageData },
                    new MySqlParameter("@title", req.addInfo["title"].ToString()),
                    new MySqlParameter("@subtitle", req.addInfo["subtitle"].ToString())
                };

                var sq = @"INSERT INTO pc_student.Skillup_Onboarding(image, title, subtitle) VALUES(@image, @title, @subtitle)";

                var insertResult = ds.executeSQL(sq, insertParams);
                if (insertResult[0].Count() == 0 && insertResult == null)
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "Unsuccessful";
                }
                else
                {
                    resData.rData["rCode"] = 0;
                    resData.rData["rMessage"] = "ID Create Successful";
                }
            }
            catch (Exception ex)
            {
                resData.rData["rCode"] = 1;
                resData.rData["rMessage"] = "An error occurred: " + ex.Message;
            }
            return resData;
        }

        public async Task<responseData> ReadData(requestData req)
        {
            responseData resData = new responseData();
            try
            {
                MySqlParameter[] Params = new MySqlParameter[]
              {
                        new MySqlParameter("@id", req.addInfo["id"]),

              };
                var selectQuery = @"SELECT * FROM pc_student.Skillup_Onboarding where id=@id";

                var selectResult = ds.executeSQL(selectQuery, Params);
                if (selectResult[0].Count() == 0)
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "No Id found";
                }
                else
                {
                    resData.rData["rCode"] = 0;
                    resData.rData["rMessage"] = "Id retrieved Successfully";
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

        public async Task<responseData> UpdateData(requestData req)
        {
            responseData resData = new responseData();
            try
            {
                byte[] imageData = null;

                // Check if the request contains a new image file to update
                if (req.addInfo.ContainsKey("image"))
                {
                    var filePath = req.addInfo["image"].ToString();
                    imageData = File.ReadAllBytes(filePath);
                }

                // Parameters for SQL query
                MySqlParameter[] updateParams = null;

                // Check if image data is available to update
                if (imageData != null)
                {
                    updateParams = new MySqlParameter[]
                    {
                new MySqlParameter("@id", req.addInfo["id"].ToString()),
                new MySqlParameter("@image", MySqlDbType.Blob) { Value = imageData },
                new MySqlParameter("@title", req.addInfo["title"].ToString()),
                new MySqlParameter("@subtitle", req.addInfo["subtitle"].ToString()),
                    };
                }
                

                // SQL query to update record
                var updateQuery = @"UPDATE pc_student.Skillup_Onboarding 
                            SET title = @title, subtitle = @subtitle " + (imageData != null ? ", image = @image " : "") +
                                    "WHERE id = @id";

                // Execute SQL update query
                var updateResult = ds.executeSQL(updateQuery, updateParams);

                // Check if update was successful
                if (updateResult == null || updateResult.Count() == 0)
                {
                    resData.rData["rCode"] = 1;
                    resData.rData["rMessage"] = "Unsuccessful update";
                }
                else
                {
                    resData.rData["rCode"] = 0;
                    resData.rData["rMessage"] = "Updated Successfully";
                }
            }
            catch (Exception ex)
            {
                resData.rData["rCode"] = 1;
                resData.rData["rMessage"] = "An error occurred: " + ex.Message;
            }
            return resData;
        }


        public async Task<responseData> DeleteData(requestData req)
        {
            responseData resData = new responseData();
            try
            {
                // Create MySQL parameters for the delete query
                MySqlParameter[] deleteParams = new MySqlParameter[]
                {
                    new MySqlParameter("@id", req.addInfo["id"].ToString()),
            //   new MySqlParameter("@status",0)
                };

                // Define the delete query
                var query = @"DELETE FROM pc_student.Skillup_Onboarding WHERE id = @id";
                //var query = @"UPDATE pc_student.Skillup_UserProfile SET status = @status WHERE id = @id";

                // Execute the delete query
                var deleteResult = ds.executeSQL(query, deleteParams);

                // Check the result of the delete operation
                if (deleteResult[0].Count() == 0 && deleteResult == null)
                {
                    resData.rData["rCode"] = 1; // Unsuccessful
                    resData.rData["rMessage"] = "id Unsuccessful delete";
                }
                else
                {
                    resData.rData["rCode"] = 0; // Successful
                    resData.rData["rMessage"] = "Id delete Successful";
                }
            }
            catch (Exception ex)
            {
                // Handle any exceptions that occur during the operation
                resData.rData["rCode"] = 1; // Indicate an error
                resData.rData["rMessage"] = "Error: " + ex.Message;
            }

            // Return the response data
            return resData;
        }

    }
}

