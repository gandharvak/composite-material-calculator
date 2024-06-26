from fastapi import HTTPException
import httpx


async def sendOTP(otp, phoneNumber):
    url = "enter_url_here"

    token = "enter_token_here"

    body = {
        "route": "otp",
        "variables_values": otp,
        "numbers": phoneNumber
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                url,
                json=body,
                headers={"Authorization": token}
            )

            # Check if the request was successful
            response.raise_for_status()

            # Process the response from the external API as needed
            return {"OTP API Response": response.json()}
        except httpx.HTTPStatusError as e:
            # Handle exceptions or errors from the external API
            raise HTTPException(status_code=e.response.status_code, detail="External API request failed.")
