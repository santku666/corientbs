

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

export const Required = (input) => required(input)