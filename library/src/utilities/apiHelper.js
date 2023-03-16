import axios from "axios";

/**
 * ----------------------------------
 *  creating axios config default
 * ----------------------------------
 * */ 
const axiosInst=axios.create({
    baseURL:"http://localhost/corientbs/server/api",
    headers:{
        "Content-Type":"application/json"
    }
});

/**
 * ------------------------------------------
 *  creating call api function with axios
 * -----------------------------------------
 * */ 
async function CallApi(url,method,data,headers){
    try {
        const options={
            url:url,
            method:method,
            data:data,
            headers:headers,
            mode:"cors"
        };
        const response=await axiosInst(options);
        return response;
    } catch (error) {
        console.log(error.response);
        return error;
    }
}

/**
 * ###################################
 *     exposed methods for interface
 * ##################################
 * */ 
export const GET = (path,headers={})=>CallApi(path,"GET",headers);
export const POST = (path,data,headers={})=>CallApi(path,"POST",data,headers);
export const PUT = (path,data,headers={})=>CallApi(path,"PUT",data,headers);
export const DELETE =(path,headers={})=>CallApi(path,"DELETE",headers);

export default axiosInst; //default file export