import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BlockStack, Box, Button, Divider, InlineStack, Text } from "@shopify/polaris";
import { ArrowLeftIcon } from "@shopify/polaris-icons";
import { NavMenu, useAppBridge } from "@shopify/app-bridge-react";

interface TabAction {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "plain" | "tertiary";
  modalId?: string;
}

interface Tab {
  id: string;
  href: string;
  matchRoute?: string;
  content: string;
  description?: string;
  showInNavMenu: boolean;
  showInHeader: boolean;
  headerTitle?: string | ((paths: string[], tabs: Tab[], selected: number | null) => string);
  backButton?: {
    show: boolean;
    path?: string;
  };
  customContent?: React.ReactElement;
  actions?: {
    buttons?: TabAction[];
  };
  rel?: string;
}

interface UnifiedNavigationProps {
  tabs?: Tab[];
  showNavMenu?: boolean;
  showHeader?: boolean;
}

/**
 * UnifiedNavigation - A flexible navigation component that handles both NavMenu and plain navigation header
 */
export const UnifiedNavigation = ({
  tabs = [],
  showNavMenu = true,
  showHeader = true,
}: UnifiedNavigationProps): React.ReactElement => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const shopify = useAppBridge();

  /**
   * Checks if a pathname matches a route pattern
   * Supports wildcards (*) and ignores query parameters and hash
   */
  const matchesRoute = (pathname: string, pattern: string): boolean => {
    if (!pattern) return false;

    // Remove query params and hash from pathname
    const cleanPath = pathname.split("?")[0].split("#")[0];

    // Exact match
    if (cleanPath === pattern) return true;

    // Wildcard match - convert pattern to regex
    // Escape special regex characters except *
    const regexPattern = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(cleanPath);
  };

  /**
   * Find the selected tab based on current pathname
   * Prioritizes more specific routes over general ones
   */
  const findSelectedTab = (): number | null => {
    if (tabs.length === 0) return 0;

    const cleanPath = pathname.split("?")[0].split("#")[0];

    // Sort tabs by specificity (longer patterns first, wildcards last)
    const sortedTabs = tabs
      .map((tab, index) => ({ tab, index }))
      .sort((a, b) => {
        const aPattern = a.tab.matchRoute || a.tab.href || "";
        const bPattern = b.tab.matchRoute || b.tab.href || "";

        // Exact matches (no wildcards) take priority
        const aHasWildcard = aPattern.includes("*");
        const bHasWildcard = bPattern.includes("*");

        if (aHasWildcard !== bHasWildcard) {
          return aHasWildcard ? 1 : -1;
        }

        // Longer patterns are more specific
        return bPattern.length - aPattern.length;
      });

    // Find first matching tab
    for (const { tab, index } of sortedTabs) {
      const pattern = tab.matchRoute || tab.href;
      if (pattern && matchesRoute(cleanPath, pattern)) {
        return index;
      }
    }

    // Fallback: if pathname is root, return first tab
    if (cleanPath === "/" || cleanPath === "") {
      return 0;
    }

    return null;
  };

  const [selected, setSelected] = useState<number | null>(() => findSelectedTab());

  // Filter tabs that should show in NavMenu
  const navMenuTabs = tabs.filter((tab) => tab.showInNavMenu);

  // Update selected tab based on path
  useEffect(() => {
    const newSelected = findSelectedTab();
    setSelected(newSelected);
  }, [pathname, tabs]);

  // Resolve title and description for header
  const selectedTab = selected !== null ? tabs[selected] : undefined;

  // Get path segments for custom title resolvers
  const pathSegments = pathname.split("/").filter(Boolean);

  let resolvedTitle = "";
  if (selectedTab) {
    if (typeof selectedTab.headerTitle === "function") {
      resolvedTitle = selectedTab.headerTitle(pathSegments, tabs, selected);
    } else if (selectedTab.headerTitle) {
      resolvedTitle = selectedTab.headerTitle;
    } else {
      resolvedTitle = selectedTab.content || "";
    }
  }

  const resolvedDescription = selectedTab?.description || null;
  const backButtonConfig = selectedTab?.backButton || { show: false };
  const customContent = selectedTab?.customContent || null;
  const actions = selectedTab?.actions || { buttons: [] };

  return (
    <>
      {/* Side Navigation (NavMenu) - Can be placed anywhere */}
      {showNavMenu && navMenuTabs.length > 0 && (
        <NavMenu>
          {navMenuTabs.map((tab, index) => (
            <a key={index} href={tab.href} rel={tab.rel}>
              {tab.content}
            </a>
          ))}
        </NavMenu>
      )}{" "}
      {/* Plain Navigation Header */}
      {showHeader && (
        <Box as="div" id="nav">
          <BlockStack gap="400">
            <InlineStack align="space-between" blockAlign="center" gap={"800"}>
              <Text as="h1" variant="headingLg" fontWeight="bold">
                {backButtonConfig.show ? (
                  <InlineStack blockAlign="center" gap={"300"}>
                    <Button
                      variant="tertiary"
                      icon={ArrowLeftIcon}
                      onClick={() => navigate(backButtonConfig.path || "/")}
                    />
                    <Text variant="headingLg" as="span">
                      {resolvedTitle}
                    </Text>
                    {customContent}
                    {actions.buttons?.map((button, index) => (
                      <Button
                        key={index}
                        variant={button.variant || "primary"}
                        onClick={() => {
                          if (button.modalId) {
                            shopify.modal.show(button.modalId);
                          } else if (button.onClick) {
                            button.onClick();
                          }
                        }}
                      >
                        {button.label}
                      </Button>
                    ))}
                  </InlineStack>
                ) : (
                  resolvedTitle
                )}
              </Text>
            </InlineStack>

            {resolvedDescription && <p>{resolvedDescription}</p>}

            <Divider />
          </BlockStack>
          <style>
            {`
              #nav {
                padding: 0 24px;
              }
            `}
          </style>
        </Box>
      )}
    </>
  );
};
