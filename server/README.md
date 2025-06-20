✅ You throw:

throw new ApiError(404, "User not found");
or in controller:

return next(new ApiError(403, "Access denied"));

if (!email) {
throw new ApiError(400, "Email is required", [
{ field: "email", message: "Email cannot be empty" },
]);
}

{
"success": false,
"message": "Email is required",
"errors": [
{
"field": "email",
"message": "Email cannot be empty"
}
],
"data": null,
"stack": "..." // only in dev
}
