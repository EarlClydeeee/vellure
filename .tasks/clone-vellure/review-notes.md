# QA Review Notes — Vellure Store Refactor

**Status**: ACCEPTABLE  
**Date**: 2026-08-03  
**Reference**: `.tasks/clone-vellure/screenshots/mockup-shop-desktop.png`

## Critical
_None_

## Major
_None after implementation_

## Minor
- Star ratings use placeholder 5.0 until reviews DB exists
- Shop hero uses CSS gradient fallback when image unavailable
- Best Seller / On Discount filters are UI-only v1 (sort links)

## Acceptance Checklist
- [x] Vellure splash on first store visit per session
- [x] `/products` has hero, sidebar, search, 3-col grid, pagination, recommendations
- [x] Store nav links show loading feedback (skeleton + progress bar)
- [x] Branding says Vellure everywhere
- [x] Mobile: sidebar collapses to sheet; grid 1–2 columns
