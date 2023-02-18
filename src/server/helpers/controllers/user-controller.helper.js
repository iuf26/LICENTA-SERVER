// 4 digits
const generateOtp = () => {
    return `${Math.floor(1000 + Math.random() * 9000)}`;
}

export const sendOtpVerificationEmail = async () => {   
    try{
        const otp = generateOtp();
    }catch(error){

    }
}