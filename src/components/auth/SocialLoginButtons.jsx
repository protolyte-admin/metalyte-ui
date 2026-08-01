import { AppleFilled, GoogleOutlined } from "@ant-design/icons";

import MarqButton from "../common/MarqButton";

export default function SocialLoginButtons() {
    return (
        <div className="auth-social-grid">
            <MarqButton icon={<GoogleOutlined />} className="auth-social-button">
                Google
            </MarqButton>
            <MarqButton icon={<AppleFilled />} className="auth-social-button">
                Apple
            </MarqButton>
        </div>
    );
}