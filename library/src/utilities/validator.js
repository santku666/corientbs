

/**
 * --------------------------------------------------
 *     All Validator functions to be provided here
 * ---------------------------------------------------
 * */ 

const required = (input) =>{
    return (
        input === null || input === "" ? false : true
    );
}

const non_negative = (input)=>{
    return (
        input < 0 ? false : true
    );
}


export const Required = (input) => required(input)
export const Non_negative = (input) => non_negative(input)