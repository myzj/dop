using System;
using System.CodeDom;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading;
using System.Web;
using System.Web.Script.Serialization;
using System.Xml;
using DopPlugin.DocHandler;
using DopPlugin.Models;
using Newtonsoft.Json;
using ServiceStack.Text;
using ServiceStack.WebHost.Endpoints;
using YamlDotNet.Serialization;

namespace DopPlugin
{
    public class GanerateDocHandler : IHttpHandler
    {
        private const string responseFormat = "{{\"success\": {0},\"message\": \"{1}\",\"data\": {2} }}";
        private const string actionPrePath = "/json/reply/";


        public GanerateDocHandler()
        {
            jsonDataTypeDict.Add(typeof(bool).FullName, "boolean");
            jsonDataTypeDict.Add(typeof(DateTime).FullName, "string");
            jsonDataTypeDict.Add(typeof(Int16).FullName, "int");
            jsonDataTypeDict.Add(typeof(Int32).FullName, "int");
            jsonDataTypeDict.Add(typeof(Int64).FullName, "int");
            jsonDataTypeDict.Add(typeof(float).FullName, "int");
            jsonDataTypeDict.Add(typeof(double).FullName, "int");
            jsonDataTypeDict.Add(typeof(decimal).FullName, "int");
        }


        private static readonly Dictionary<Type, string> valueTypeDic = new Dictionary<Type, string> {
            {typeof(byte), FieldType.Byte},
            {typeof(sbyte), FieldType.Byte},
            {typeof(bool), FieldType.Boolean},
            {typeof(short), FieldType.Int},
            {typeof(ushort), FieldType.Int},
            {typeof(int), FieldType.Int},
            {typeof(uint), FieldType.Int},
            {typeof(long), FieldType.Long},
            {typeof(ulong), FieldType.Long},
            {typeof(float), FieldType.Float},
            {typeof(double), FieldType.Double},
            {typeof(decimal), FieldType.Double},
            {typeof(string), FieldType.String},
            {typeof(DateTime), FieldType.Date}
        };

        private static List<string> allType = new List<string>()
        {
            FieldType.Byte,
            FieldType.Boolean,
            FieldType.Int,
            FieldType.Long,
            FieldType.Float,
            FieldType.Double,
            FieldType.String,
            FieldType.Date
        };

        private static Type parentType = null;

        private static Dictionary<string, Model> ModelList = new Dictionary<string, Model>();

        public bool IsReusable
        {
            get { return false; }
        }

        public void ProcessRequest(HttpContext context)
        {
            try
            {
                //var serviceDic = EndpointHost.Config.ServiceManager.Metadata.OperationNamesMap;//获取servicestack所有接口列表
                //var serviceList = new List<Service>();
                //指定查询
                var queryAction = context.Request["actionName"] ?? "";
                //var format = (context.Request["format"] ?? "json").ToUpper();
                //var docType = (context.Request["type"] ?? "swagger").ToUpper();

                var filterNames = queryAction.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);

                var postman = new PostmanHandler(filterNames);
                WriteData(HttpContext.Current.Response, "json", postman.ModelData);

                //if (!string.IsNullOrWhiteSpace(queryAction))
                //{
                //    var queryActionAry = queryAction.Replace(actionPrePath, string.Empty).ToLower().Split(',');
                //    serviceDic = serviceDic.Where(t => queryActionAry.Contains(t.Key)).ToDictionary(k => k.Key, v => v.Value);
                //}
                //foreach (var service in serviceDic)
                //{
                //    var ser = new Service()
                //    {
                //        ActionName = actionPrePath + service.Value.Name,
                //        HttpMethod = ConverToHttpMethod(service.Value.Actions[0])
                //    };
                //    //请求实体
                //    ser.RequestModel = new Field()
                //    {
                //        TypeModel = ConverModel(service.Value.RequestType),
                //        FieldName = service.Value.RequestType.IsGenericType && service.Value.RequestType.GetGenericArguments() != null ?
                //        service.Value.RequestType.GetGenericArguments()[0].Name : service.Value.RequestType.Name,
                //        //Type = service.Value.RequestType.IsGenericType && service.Value.RequestType.GetGenericArguments() != null ?
                //        // service.Value.RequestType.GetGenericArguments()[0].Name : service.Value.RequestType.Name
                //        Type = service.Value.RequestType.IsGenericType && service.Value.RequestType.GetGenericArguments() != null ?
                //        service.Value.RequestType.Name + "<" + service.Value.RequestType.GetGenericArguments()[0].Name + ">" : service.Value.RequestType.Name
                //    };
                //    //响应实体
                //    ser.ResponseModel = new Field()
                //    {
                //        TypeModel = ConverModel(service.Value.ResponseType),
                //        FieldName = service.Value.ResponseType.IsGenericType && service.Value.ResponseType.GetGenericArguments() != null ?
                //        service.Value.ResponseType.GetGenericArguments()[0].Name : service.Value.ResponseType.Name,
                //        //Type = service.Value.ResponseType.IsGenericType && service.Value.ResponseType.GetGenericArguments() != null ?
                //        //service.Value.ResponseType.GetGenericArguments()[0].Name : service.Value.ResponseType.Name
                //        Type = service.Value.ResponseType.IsGenericType && service.Value.ResponseType.GetGenericArguments() != null ?
                //       service.Value.ResponseType.Name.Substring(0, service.Value.ResponseType.Name.Length - 2) + "<" + service.Value.ResponseType.GetGenericArguments()[0].Name + ">" : service.Value.ResponseType.Name
                //    };

                //    serviceList.Add(ser);
                //    //break;
                //}

                //switch (docType)
                //{
                //    case "SWAGGER":
                //        var swagger = ConvertServiceToSwagger(serviceList);
                //        WriteData(HttpContext.Current.Response, format, swagger);
                //        break;
                //    case "POSTMAN":
                //        var postman = new PostmanHandler();
                //        WriteData(HttpContext.Current.Response, format, postman.GetJson());
                //        break;
                //}
            }
            catch (ThreadAbortException ex)
            {
                return;
            }
            catch (Exception ex)
            {
                ConsoleResponse(false, "", ex.ToString());
            }
        }

        //private Postman ConvertServiceToPostman(List<Service> serviceList)
        //{
        //    var serviceMap = EndpointHost.Config.ServiceManager.Metadata.OperationNamesMap;

        //    var req = HttpContext.Current.Request;

        //    var data = new Postman();

        //    data.Info = new Postman.InfoModel() { Project = req.Url.ToString() };

        //    data.Item = new List<Postman.ItemModel>();
        //    foreach (var service in serviceMap)
        //    {
        //        var item = new Postman.ItemModel();

        //        item.Base = new Postman.BaseModel() { Name = service.Value.Name, Description = service.Value.Name, State = true };

        //        var request = new Postman.RequestModel()
        //        {
        //            Url = "/json/reply/" + service.Value.Name,
        //            Method = service.Value.Actions.FirstOrDefault(),
        //            ContentType = "application/json"
        //        };
        //        request.Body = new List<Postman.FieldModel>();

        //        var reqProps = service.Value.RequestType.GetProperties();
        //        foreach (var propInfo in reqProps)
        //        {
        //            var fieldModel = new Postman.FieldModel();
        //            fieldModel.FieldName = propInfo.Name;
        //            fieldModel.IsArray = propInfo.PropertyType.IsArray;
        //            fieldModel.Type = GetJsonTypeDefine(propInfo.PropertyType);

        //            request.Body.Add(fieldModel);
        //        }

        //        item.Request = request;

        //        data.Item.Add(item);
        //    }

        //    return data;
        //}

        private Dictionary<string, string> jsonDataTypeDict = new Dictionary<string, string>();

        public string GetTypeDefine(Type type)
        {
            var result = "string";
            if (jsonDataTypeDict.ContainsKey(type.FullName))
            {
                result = jsonDataTypeDict[type.FullName];
            }
            return result;
        }

        private void WriteData<T>(HttpResponse response, string format, T data)
        {
            switch (format)
            {
                case "YAML":
                    {
                        var serializer = new Serializer();
                        var writer = new StringWriter();
                        serializer.Serialize(writer, data);
                        response.Write(writer.ToString());
                        response.ContentType = "text/yaml";
                        break;
                    }
                case "JSON":
                default:
                    {
                        //var serializer = new JavaScriptSerializer();
                        //var jsstr = serializer.Serialize(data);

                        //var js = new DataContractJsonSerializer(data.GetType());
                        //MemoryStream msObj = new MemoryStream();
                        ////将序列化之后的Json格式数据写入流中
                        //js.WriteObject(msObj, data);
                        //StreamReader sr = new StreamReader(msObj, Encoding.UTF8);
                        //var jsstr = sr.ReadToEnd();
                        //sr.Close();
                        //msObj.Close();

                        var jsstr = JsonConvert.SerializeObject(data);

                        response.Write(jsstr);
                        response.ContentType = "application/json";
                        break;
                    }
            }
            response.End();
        }

        private void ConsoleResponse(bool success, string data, string message)
        {
            string content = string.Format(responseFormat, success.ToJsonString(), string.IsNullOrEmpty(message) ? "null" : message, string.IsNullOrEmpty(data) ? "null" : data);
            HttpContext.Current.Response.Write(content);
            HttpContext.Current.Response.ContentType = "application/json; charset=UTF-8";
            HttpContext.Current.Response.End();
        }

        #region <<转化swagger>>

        /// <summary>
        /// 转换为swagger
        /// </summary>
        /// <param name="dll"></param>
        /// <returns></returns>
        public Swagger ConvertServiceToSwagger(List<Service> dll)
        {
            var list = new Swagger();
            foreach (var service in dll)
            {
                var path = new SwaggerPath();
                //请求参数
                path.parameters = new List<SwaggerParam>()
                {
                    new SwaggerParam()
                    {
                        In = SwaggerParamInEnum.Body,
                        description = "",
                        name = "request",
                        required = true,
                        schema = service.RequestModel.TypeModel != null
                            ? new SwaggerPro()
                            {
                                ModelName = service.RequestModel.Type
                            }
                            : new SwaggerPro()
                            {
                                type = service.RequestModel.Type
                            }
                    }
                };
                //响应参数
                path.responses = new Dictionary<string, SwaggerResponse>()
                {
                    {
                        "200", new SwaggerResponse()
                    }
                };
                if (service.ResponseModel.TypeModel != null)
                {
                    path.responses["200"].schema = new SwaggerPro() { ModelName = service.ResponseModel.FieldName };
                }
                else
                {
                    if (service.ResponseModel.IsArray)
                    {
                        path.responses["200"].schema = new SwaggerSchemaAry()
                        {
                            type = FieldType.Array,
                            items = new SwaggerPro() { ModelName = service.ResponseModel.FieldName }
                        };
                    }
                    else
                    {
                        path.responses["200"].schema = new SwaggerPro() { type = service.ResponseModel.FieldName };
                    }
                }
                //模型
                if (service.RequestModel.TypeModel != null)
                {
                    foreach (var definion in ConverDefinions(service.RequestModel))
                    {
                        if (!list.definitions.ContainsKey(definion.Key))
                            list.definitions.Add(definion.Key, definion.Value);
                    }
                }
                if (service.ResponseModel.TypeModel != null)
                {
                    foreach (var definion in ConverDefinions(service.ResponseModel))
                    {
                        if (!list.definitions.ContainsKey(definion.Key))
                            list.definitions.Add(definion.Key, definion.Value);
                    }
                }

                list.paths.Add(service.ActionName, new Dictionary<string, SwaggerPath>()
                {
                    {
                        ConverToHttpMethod(service.HttpMethod),path
                    }
                });


            }
            return list;

        }

        /// <summary>
        /// 转换类
        /// </summary>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        public Dictionary<string, SwaggerDefinion> ConverDefinions(Field model)
        {
            var dic = new Dictionary<string, SwaggerDefinion>();
            var definion = new SwaggerDefinion() { properties = new Dictionary<string, SwaggerPro>() };
            foreach (var field in model.TypeModel.Fields)
            {
                SwaggerPro schema;
                if (field.IsArray)
                {
                    schema = new SwaggerSchemaAry()
                    {
                        type = FieldType.Array,
                        items = new SwaggerPro()
                    };
                    ConverPro(field, ((SwaggerSchemaAry)schema).items, dic);
                }
                else
                {
                    schema = new SwaggerPro();
                    ConverPro(field, schema, dic);
                }
                definion.properties.Add(field.FieldName, schema);
            }
            if (!dic.ContainsKey(model.Type))
                dic.Add(model.Type, definion);
            return dic;
        }

        public void ConverPro(Field field, SwaggerPro schema, Dictionary<string, SwaggerDefinion> dic)
        {
            if (field.TypeModel == null)
            {
                schema.type = field.Type;
            }
            else
            {
                schema.ModelName = field.Type;
                foreach (var item in ConverDefinions(field))
                {
                    if (!dic.ContainsKey(item.Key))
                        dic.Add(item.Key, item.Value);
                }
            }
        }


        #endregion

        #region <<解析类型>>

        public string ConverToHttpMethod(string method)
        {
            method = method.ToLower();
            switch (method)
            {
                case "any": method = "post"; break;
                default: break;
            }
            return method;
        }

        /// <summary>
        /// 转换可识别实体
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public Model ConverModel(Type type)
        {
            var model = new Model();
            if (ModelList.ContainsKey(type.FullName))
            {
                model = ModelList[type.FullName];
            }
            else
            {
                //标识父类 防止引用当前类造成死循环解决循环引用问题
                parentType = type;
                foreach (var pro in type.GetProperties())
                {
                    model.Fields.Add(ConvertProToModel(pro));
                }
                ModelList.Add(type.FullName, model);
            }
            return model;
        }

        /// <summary>
        /// 转化字段
        /// </summary>
        /// <param name="pro"></param>
        /// <returns></returns>
        public Field ConvertProToModel(PropertyInfo pro)
        {
            var field = new Field() { FieldName = pro.Name };

            var type = pro.PropertyType;
            //是否集合
            field.IsArray = type.IsArray ||
                (type.IsGenericType && new List<Type>() { typeof(List<>), typeof(IList<>), typeof(IEnumerable<>) }.Contains(type.GetGenericTypeDefinition()));
            if (field.IsArray)
            {
                var elementType = type.GetElementType() ?? type.GetGenericArguments()[0];
                type = elementType;
            }
            //字段是否可空
            field.IsNull = Nullable.GetUnderlyingType(type) != null;

            var lookupType = Nullable.GetUnderlyingType(type) ?? type;
            if (valueTypeDic.ContainsKey(lookupType))
            {
                //基础值类型
                field.Type = valueTypeDic[lookupType];
            }
            else
            {
                //枚举类型
                if (type.IsEnum)
                {
                    field.Type = type.Name;
                    field.IsEnum = true;
                    field.EnumValue = new List<string>();
                    foreach (var value in Enum.GetValues(type))
                    {
                        field.EnumValue.Add(value.ToString());
                    }
                }
                if (type.IsGenericType)
                {
                    var typeArgus = type.GetGenericArguments();
                    if (typeArgus != null && typeArgus.Count() > 0)
                    {
                        string argName = "";
                        for (int i = 0; i < typeArgus.Count(); i++)
                        {
                            argName += typeArgus[i].Name + ",";
                        }
                        field.Type = type.GetGenericTypeDefinition().Name + "<" +
                                     argName.Substring(0, argName.Length - 1) + ">";
                    }
                }
                if (string.IsNullOrWhiteSpace(field.Type))
                {
                    field.Type = type.Name;
                    //认定为一个类
                    if (type.GetProperties() != null && type.GetProperties().Count() > 0)
                    {
                        if (type != parentType)
                            field.TypeModel = ConverModel(type);
                        else
                            field.IsParentType = true;
                    }
                }
            }
            return field;
        }

        #endregion
    }
}
