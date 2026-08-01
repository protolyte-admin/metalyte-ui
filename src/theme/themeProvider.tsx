import { App as AntdApp, ConfigProvider, theme } from "antd";
import { useMemo } from "react";

import { tokens } from "./tokens";

const { defaultAlgorithm } = theme;

export const ThemeProvider = ({ children }) => {
    const themeConfig = useMemo(
        () => ({
            algorithm: defaultAlgorithm,
            token: {
                colorPrimary: tokens.colors.primary,
                colorSuccess: tokens.colors.success,
                colorWarning: tokens.colors.warning,
                colorError: tokens.colors.danger,
                colorInfo: tokens.colors.accent,

                layoutHeaderBackground: tokens.header.bg,
                layoutHeaderHeight: tokens.header.height,
                layoutSiderBackground: tokens.sidebar.bg,
                layoutSiderWidth: tokens.sidebar.width,
                layoutSiderCollapsedWidth: tokens.sidebar.widthCollapsed,
                layoutTriggerBg: tokens.sidebar.bg,
                layoutTriggerColor: tokens.colors.textPrimary,
                layoutTriggerColorHover: tokens.colors.primary,

                borderRadius: tokens.borderRadius.md,
                borderRadiusSM: tokens.borderRadius.sm,
                borderRadiusLG: tokens.borderRadius.lg,
                borderRadiusXL: tokens.borderRadius.xl,

                fontFamily: tokens.font.family,
                fontSize: tokens.font.size.md,
                fontSizeHeading1: 30,
                fontSizeHeading2: 24,
                fontSizeHeading3: 20,
                fontSizeHeading4: 16,
                fontSizeHeading5: 14,
                fontSizeHeading6: 12,

                controlHeight: 40,
                controlHeightLG: 48,
                controlHeightSM: 32,
                controlPaddingHorizontal: tokens.spacing.sm,

                lineWidth: 1,
                lineType: "solid",

                colorFillAlter: tokens.colors.bgElevated,
                colorFillContent: tokens.colors.bgSecondary,

                colorBgContainer: tokens.colors.bgCard,
                colorBgLayout: tokens.colors.bgPrimary,
                colorBgElevated: tokens.colors.bgCard,
                colorBgSpotlight: tokens.colors.bgCard,

                colorText: tokens.colors.textPrimary,
                colorTextHeading: tokens.colors.textPrimary,
                colorTextLabel: tokens.colors.textSecondary,
                colorTextPlaceholder: tokens.colors.textMuted,
                colorTextQuaternary: tokens.colors.textMuted,
                colorTextTertiary: tokens.colors.textSecondary,
                colorTextSecondary: tokens.colors.textSecondary,
                colorTextDisabled: tokens.colors.textMuted,

                colorBorder: tokens.colors.border,
                colorBorderSecondary: tokens.colors.border,
                colorSplit: tokens.colors.border,

                colorPrimaryHover: tokens.colors.primaryHover
            },
            components: {
                Button: {
                    colorPrimary: tokens.colors.primary,
                    colorPrimaryHover: tokens.colors.primaryHover,
                    algorithm: true
                },
                Menu: {
                    itemBg: "transparent",
                    itemHoverBg: "rgba(47, 24, 246, 0.08)",
                    itemColor: tokens.colors.textSecondary,
                    itemHoverColor: tokens.colors.primary,
                    itemSelectedColor: tokens.colors.primary,
                    itemSelectedBg: "rgba(47, 24, 246, 0.10)",
                    itemBorderRadius: 8
                },
                Input: {
                    colorBgContainer: tokens.colors.bgCard,
                    colorBorder: tokens.colors.border,
                    hoverBorderColor: tokens.colors.primary,
                    activeBorderColor: tokens.colors.primary,
                    borderRadius: tokens.borderRadius.md
                },
                Card: {
                    colorBgContainer: tokens.colors.bgCard,
                    colorBorder: tokens.colors.border,
                    borderRadius: tokens.borderRadius.md,
                    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)"
                },
                Table: {
                    colorBgContainer: tokens.colors.bgCard,
                    colorBorder: tokens.colors.border,
                    headerBg: tokens.colors.bgElevated,
                    headerColor: tokens.colors.textSecondary,
                    borderColor: tokens.colors.border,
                    headerBorderRadius: tokens.borderRadius.md
                },
                Drawer: {
                    colorBgElevated: tokens.colors.bgCard,
                    colorBorder: tokens.colors.border,
                    borderRadius: tokens.borderRadius.md
                },
                Modal: {
                    colorBgElevated: tokens.colors.bgCard,
                    colorBorder: tokens.colors.border,
                    borderRadius: tokens.borderRadius.md
                },
                Select: {
                    colorBgContainer: tokens.colors.bgCard,
                    colorBorder: tokens.colors.border,
                    hoverBorderColor: tokens.colors.primary,
                    activeBorderColor: tokens.colors.primary,
                    borderRadius: tokens.borderRadius.md,
                    optionActiveBg: "rgba(47, 24, 246, 0.08)",
                    optionSelectedBg: "rgba(47, 24, 246, 0.10)"
                },
                Timeline: {
                    tailColor: tokens.colors.border,
                    dotBg: tokens.colors.bgCard
                },
                Tooltip: {
                    colorBgSpotlight: "#111827",
                    colorTextLightSolid: "#FFFFFF"
                }
            }
        }),
        []
    );

    return (
        <ConfigProvider theme={themeConfig}>
            <AntdApp>{children}</AntdApp>
        </ConfigProvider>
    );
};

export default ThemeProvider;