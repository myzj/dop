using System;
using System.Collections.Generic;
using System.ComponentModel;
using ServiceStack.Common;
using ServiceStack.ServiceHost;
using ServiceStack.ServiceInterface.ServiceModel;
using TestWeb.Repository;

namespace TestWeb.Service
{
    //Request DTO 
    [Route(path: "/test1", Notes = "备注", Summary = "总结")]
    [Route(path: "/Hello")]
    [Description("测试接口 Hello")]
    public class Hello
    {
        [ApiMember(Name = "name", Description = "测试的名称")]
        public string Name { get; set; }

        [ApiMember(Name = "user_id", Description = "用户id")]
        public int UserId { get; set; }

        [ApiMember(Description = "用户id")]
        public bool IsDelete { get; set; }

        [ApiMember(Description = "用户id")]
        public DateTime CreateTime { get; set; }

        [ApiMember(Description = "用户id")]
        public long timestamp { get; set; }

        [ApiMember(Description = "用户id")]
        public List<int> ids { get; set; }

        [ApiMember(Description = "用户id")]
        public TestItem1 TestItem1 { get; set; }

        [ApiMember(Description = "用户id")]
        public List<TestItem1> TestItem1s { get; set; }
    }

    public class TestItem1
    {
        [ApiMember(Description = "用户id")]
        public string t1p { get; set; }

        [ApiMember(Description = "用户id")]
        public string t2p { get; set; }
    }

    [Description("Hello1接口")]
    public class Hello1
    {
        [ApiMember(Description = "姓名")]
        public string Name { get; set; }

        [ApiMember(Description = "用户ID")]
        public int UserId { get; set; }

        [ApiMember(Description = "是否删除")]
        public bool IsDelete { get; set; }

        [ApiMember(Description = "创建时间")]
        public DateTime CreateTime { get; set; }

        [ApiMember(Description = "时间戳")]
        public long timestamp { get; set; }
    }

    //Response DTO 
    public class HelloResponse
    {
        [ApiMember(Description = "用户id")]
        public string Name { get; set; }

        [ApiMember(Description = "用户id")]
        public int UserId { get; set; }

        [ApiMember(Description = "用户id")]
        public bool IsDelete { get; set; }

        [ApiMember(Description = "用户id")]
        public DateTime CreateTime { get; set; }

        [ApiMember(Description = "用户id")]
        public long timestamp { get; set; }

        [ApiMember(Description = "用户id")]
        public string Result { get; set; }

        //[ApiMember(Description = "用户id")]
        //public ResponseStatus ResponseStatus { get; set; } //Where Exceptions get auto-serialized 
    }

    //Can be called via any endpoint or format, see: http://servicestack.net/ServiceStack.Hello/ 
    public class HelloService : ServiceStack.ServiceInterface.Service
    {
        public HelloResponse Any(Hello request)
        {
            return new HelloResponse { Result = "Hello, " + request.Name };
        }

        public List<HelloResponse> Post(Hello1 request)
        {
            return null;
        }
    }

    //REST Resource DTO 
    [Route("/todos")]
    [Route("/todos/{Ids}")]
    public class Todos : IReturn<List<Todo>>
    {
        public long[] Ids { get; set; }
        public Todos(params long[] ids)
        {
            this.Ids = ids;
        }
    }

    [Route("/todos", "POST")]
    [Route("/todos/{Id}", "PUT")]
    public class Todo : IReturn<Todo>
    {
        public long Id { get; set; }
        public string Content { get; set; }
        public int Order { get; set; }
        public bool Done { get; set; }
    }

    public class TodosService : ServiceStack.ServiceInterface.Service
    {
        public TodoRepository Repository { get; set; }  //Injected by IOC

        public object Get(Todos request)
        {
            return request.Ids.IsEmpty()
                ? Repository.GetAll()
                : Repository.GetByIds(request.Ids);
        }

        public object Post(Todo todo)
        {
            return Repository.Store(todo);
        }

        public object Put(Todo todo)
        {
            return Repository.Store(todo);
        }

        public void Delete(Todos request)
        {
            Repository.DeleteByIds(request.Ids);
        }
    }

}