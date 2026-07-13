"use client"

import { useCallback } from "react"
import { motion } from "@repo/motion"
import { Box, Typography, useTheme } from "@repo/ui/mui"

import { TABS, TAB_ORDER, TabKey } from "../../types/tabs"
import { useTabs } from "../../context/Tabs"
import { useTabNavigation } from "../../hooks/useTabNavigation"
import ExploreSubNav from "../../features/scenarioExplorer/explorer/tools/chrome/nav/ExploreSubNav"

export default function SmoothTabs() {
  const { state, tabsRef, isInTabsArea } = useTabs()
  const { activeTab } = state
  const { navigateToTab } = useTabNavigation()
  const theme = useTheme()

  const onSelect = useCallback(
    (tab: TabKey | undefined) => {
      if (tab && tab !== activeTab) navigateToTab(tab)
    },
    [activeTab, navigateToTab],
  )

  // Keyboard support A11y: ArrowLeft/Right, Home/End
  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    const idx = TAB_ORDER.indexOf(activeTab)

    if (e.key === "ArrowRight")
      onSelect(TAB_ORDER[(idx + 1) % TAB_ORDER.length])
    if (e.key === "ArrowLeft")
      onSelect(TAB_ORDER[(idx - 1 + TAB_ORDER.length) % TAB_ORDER.length])
    if (e.key === "Home") onSelect(TAB_ORDER[0])
    if (e.key === "End") onSelect(TAB_ORDER[TAB_ORDER.length - 1])
  }

  const activeTabColor = TABS.find((t) => t.key === activeTab)?.panelColor

  return (
    <div
      id="tabs"
      ref={tabsRef}
      style={{
        position: "sticky",
        top: theme.layout.collapsedHeaderHeight,
        zIndex: theme.zIndex.appBar,
        // Pull the tabs up in normal flow so that, while still above
        // their sticky threshold, they overlap the bottom of the
        // preceding panel. Once they enter the sticky state, `top`
        // takes over and pins the docked nav-bar at the correct anchor,
        // so this margin has no effect on the docked position.
        //
        // Keep this overlap no larger than the opaque height of the
        // floating tab row (~45px) plus the colored bar
        // (collapsedTabHeight, 44px). If it exceeds that, the bottom of
        // the preceding panel peeks out below the bar.
        marginTop: "-80px",
        backgroundColor: isInTabsArea
          ? theme.palette.common.white
          : "transparent",
        pointerEvents: "auto",
      }}
    >
      <div
        role="tablist"
        aria-label="tab-sections"
        onKeyDown={handleKeyDown}
        className="tab-container"
        style={{
          // Grid with 3 equal columns so each tab lives in a cell that
          // is exactly 1/3 of the viewport wide. When expanded, each
          // tab is narrower than its cell and centered inside it
          // (halo on both sides). When docked, tabs stretch to fill
          // their cells for the continuous nav-bar look.
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          width: "100%",
          pointerEvents: "auto",
          boxSizing: "border-box",
        }}
      >
        {TABS.map(({ key, label, panelColor }) => {
          const selected = key === activeTab
          return (
            <Box
              key={key}
              component="button"
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`panel-${key}`}
              id={`tab-${key}`}
              onClick={() => onSelect(key)}
              tabIndex={selected ? 0 : -1}
              sx={{
                justifySelf: "center",
                width: "85%",
                position: "relative",
                border: "none",
                backgroundColor: panelColor,
                cursor: "pointer",
                color: theme.palette.common.white,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                display: "flex",
                flexDirection: "column",
                gap: 0,
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: isInTabsArea
                  ? "0 20px"
                  : `14px ${theme.space.panel.padding}`,
                height: isInTabsArea
                  ? theme.layout.collapsedTabHeight
                  : undefined,
                borderTop: "none",
                borderBottom: "none",
                "&:focus-visible": {
                  outline: `2px solid ${theme.palette.common.white}`,
                  outlineOffset: 2,
                },
              }}
            >
              {/* Active tab indicator - only show when expanded, hide when docked */}
              {selected && !isInTabsArea && (
                <motion.span
                  layoutId="seg-pill"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: 5,
                    background: `var(--accent, ${panelColor})`,
                  }}
                />
              )}
              <Typography
                component="span"
                variant="nav"
                sx={{ color: "inherit" }}
              >
                {label}
              </Typography>
            </Box>
          )
        })}
      </div>

      {/* Full-width bar in the active tab color, spanning left to right,
          in place of the old text aprons. */}
      <Box
        sx={{
          width: "100%",
          height: theme.layout.collapsedTabHeight,
          backgroundColor: activeTabColor,
          marginTop: "-1px",
        }}
      />

      <ExploreSubNav />
    </div>
  )
}
