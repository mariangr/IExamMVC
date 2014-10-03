using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;

namespace IExam.Helpers
{
    public static class ObjPropertyGetter
    {
        public static PropertyInfo[] GetProperties(object obj)
        {
            return obj.GetType().GetProperties();
        }
    }
}