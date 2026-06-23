import ApiResponse from "../responses/ApiResponse.js";

const sendSuccessResponse = (
    res,
    statusCode,
    code,
    message,
    data = null
) => {
    return res
        .status(statusCode)
        .json(
            new ApiResponse(
                statusCode,
                data,
                code,
                message
            )
        );
};

export default sendSuccessResponse;