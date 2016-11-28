using System.Collections.Generic;
using ServiceStack.Common.ServiceModel;
using YamlDotNet.Serialization;

namespace DopPlugin
{
    public class Service
    {
        public string HttpMethod { get; set; }

        public Field ResponseModel { get; set; }

        public Field RequestModel { get; set; }

        public string ActionName { get; set; }
    }
    
    public class Model
    {
        public Model()
        {
            Fields = new List<Field>();
        }

        public List<Field> Fields { get; set; }
    }

    public class Field
    {
        public Field()
        {
            TypeModel = null;
            EnumValue = null;
        }

        public string Type { get; set; }

        public string FieldName { get; set; }

        public bool IsArray { get; set; }

        public bool IsNull { get; set; }

        public Model TypeModel { get; set; }
        /// <summary>
        /// 是否为循环引用
        /// </summary>
        public bool IsParentType { get; set; }

        public bool IsEnum { get; set; }

        public List<string> EnumValue { get; set; }
    }


    public struct FieldType
    {
        public const string Array = "array";
        public const string Boolean = "boolean";
        public const string Byte = "byte";
        public const string Date = "date";
        public const string Double = "double";
        public const string Float = "float";
        public const string Int = "int";
        public const string Long = "long";
        public const string String = "string";
    }


    #region <<swagger>>
    
    public class Swagger
    {
        public Swagger()
        {
            info = new SwaggerInfo();
            schemes = new List<string>();
            paths = new Dictionary<string, Dictionary<string, SwaggerPath>>();
            definitions = new Dictionary<string, SwaggerDefinion>();
        }
        public SwaggerInfo info { get; set; }

        public string host { get; set; }

        public List<string> schemes { get; set; }

        public Dictionary<string, Dictionary<string, SwaggerPath>> paths { get; set; }

        public Dictionary<string, SwaggerDefinion> definitions { get; set; }
    }
    public class SwaggerInfo
    {
        public int version { get; set; }

        public string title { get; set; }
    }

    public class SwaggerPath
    {
        public string description { get; set; }

        public List<SwaggerParam> parameters { get; set; }

        public Dictionary<string, SwaggerResponse> responses { get; set; }
    }

    public class SwaggerParam
    {
        public string name { get; set; }
        [YamlMember(Alias = "in")]
        public string In { get; set; }
        public string description { get; set; }
        public bool required { get; set; }
        public string type { get; set; }
        public SwaggerPro schema { get; set; }
    }

    public class SwaggerSchema
    {
        private string _modelName = "";
        [YamlMember(Alias = "$ref")]
        public string ModelName
        {
            get
            {
                if (!string.IsNullOrWhiteSpace(_modelName))
                    return "#/definitions/" + _modelName;
                return null;
            }
            set { _modelName = value; }
        }
    }

    public class SwaggerSchemaAry : SwaggerPro
    {
        public SwaggerPro items { get; set; }
    }

    public class SwaggerResponse
    {
        public string description { get; set; }

        public SwaggerPro schema { get; set; }
    }

    //public class Schema
    //{
    //}

    public class SwaggerPro : SwaggerSchema
    {
        public string type { get; set; }
    }

    public class SwaggerDefinion
    {
        public Dictionary<string, SwaggerPro> properties { get; set; }
    }

    public class SwaggerParamInEnum
    {
        public const string Body = "body";
        public const string Path = "path";
        public const string Header = "header";
        public const string Query = "query";
        public const string Form = "formData";
    }

    #endregion

}
