export interface BodyRegion {
  id: string
  label: string
  termIds: string[]
  rect: [number, number, number, number]
}

export interface BodyView {
  imageFile: string
  label: string
  regions: BodyRegion[]
}

const HEAD: BodyRegion = {
  id: 'head',
  label: 'Head',
  termIds: [
    'sk-002', 'sk-003', 'sk-004', 'sk-026', 'sk-027', 'sk-028',
    'mu-016',
    'nv-001', 'nv-009', 'nv-010', 'nv-011', 'nv-012', 'nv-013',
    'nv-014', 'nv-015', 'nv-016', 'nv-017', 'nv-018', 'nv-024', 'nv-025',
    're-009',
    'di-013', 'di-014', 'di-015',
  ],
  rect: [580, 20, 248, 120],
}

const NECK: BodyRegion = {
  id: 'neck',
  label: 'Neck',
  termIds: ['mu-017', 're-007', 're-008', 're-010'],
  rect: [640, 140, 128, 55],
}

const CHEST: BodyRegion = {
  id: 'chest',
  label: 'Chest',
  termIds: [
    'sk-005', 'sk-007', 'sk-008',
    'mu-006', 'mu-015',
    're-001', 're-002', 're-003', 're-004', 're-005', 're-006',
    're-017', 're-018', 're-020',
    'cv-001', 'cv-005', 'cv-006', 'cv-007', 'cv-008', 'cv-009',
    'cv-010', 'cv-011', 'cv-012', 'cv-013',
    'cv-024', 'cv-025', 'cv-026', 'cv-027', 'cv-028',
  ],
  rect: [570, 195, 268, 145],
}

const ABDOMEN: BodyRegion = {
  id: 'abdomen',
  label: 'Abdomen',
  termIds: [
    'mu-013', 'mu-014',
    'di-001', 'di-002', 'di-003', 'di-004', 'di-005', 'di-006',
    'di-007', 'di-008', 'di-009', 'di-010',
    'di-016', 'di-017', 'di-018', 'di-019',
    'di-021', 'di-022', 'di-026', 'di-027',
  ],
  rect: [590, 340, 228, 140],
}

const PELVIS: BodyRegion = {
  id: 'pelvis',
  label: 'Pelvis',
  termIds: [
    'sk-011', 'sk-024', 'sk-025',
    'mu-009', 'mu-024',
    'di-011', 'di-012', 'di-020',
  ],
  rect: [620, 480, 168, 70],
}

const RIGHT_UPPER_ARM: BodyRegion = {
  id: 'right-upper-arm',
  label: 'Right Upper Arm',
  termIds: ['sk-016', 'mu-002', 'mu-003', 'mu-005'],
  rect: [838, 220, 140, 150],
}

const RIGHT_FOREARM: BodyRegion = {
  id: 'right-forearm',
  label: 'Right Forearm',
  termIds: ['sk-017', 'sk-018'],
  rect: [878, 370, 140, 140],
}

const RIGHT_HAND: BodyRegion = {
  id: 'right-hand',
  label: 'Right Hand',
  termIds: ['sk-019', 'sk-020', 'sk-021'],
  rect: [898, 510, 100, 70],
}

const LEFT_UPPER_ARM: BodyRegion = {
  id: 'left-upper-arm',
  label: 'Left Upper Arm',
  termIds: ['sk-016', 'mu-002', 'mu-003', 'mu-005'],
  rect: [430, 220, 140, 150],
}

const LEFT_FOREARM: BodyRegion = {
  id: 'left-forearm',
  label: 'Left Forearm',
  termIds: ['sk-017', 'sk-018'],
  rect: [390, 370, 140, 140],
}

const LEFT_HAND: BodyRegion = {
  id: 'left-hand',
  label: 'Left Hand',
  termIds: ['sk-019', 'sk-020', 'sk-021'],
  rect: [410, 510, 100, 70],
}

const RIGHT_THIGH: BodyRegion = {
  id: 'right-thigh',
  label: 'Right Thigh',
  termIds: ['sk-012', 'sk-013', 'mu-004', 'mu-010', 'mu-021', 'mu-022'],
  rect: [718, 550, 125, 110],
}

const RIGHT_LEG: BodyRegion = {
  id: 'right-leg',
  label: 'Right Leg',
  termIds: ['sk-014', 'sk-015', 'mu-011', 'mu-012', 'mu-018'],
  rect: [728, 660, 120, 75],
}

const RIGHT_FOOT: BodyRegion = {
  id: 'right-foot',
  label: 'Right Foot',
  termIds: ['sk-022', 'sk-023'],
  rect: [728, 735, 130, 33],
}

const LEFT_THIGH: BodyRegion = {
  id: 'left-thigh',
  label: 'Left Thigh',
  termIds: ['sk-012', 'sk-013', 'mu-004', 'mu-010', 'mu-021', 'mu-022'],
  rect: [565, 550, 125, 110],
}

const LEFT_LEG: BodyRegion = {
  id: 'left-leg',
  label: 'Left Leg',
  termIds: ['sk-014', 'sk-015', 'mu-011', 'mu-012', 'mu-018'],
  rect: [560, 660, 120, 75],
}

const LEFT_FOOT: BodyRegion = {
  id: 'left-foot',
  label: 'Left Foot',
  termIds: ['sk-022', 'sk-023'],
  rect: [550, 735, 130, 33],
}

const UPPER_BACK: BodyRegion = {
  id: 'upper-back',
  label: 'Upper Back',
  termIds: ['sk-006', 'sk-009', 'sk-010', 'mu-007', 'mu-008', 'nv-002'],
  rect: [580, 195, 248, 180],
}

const LOWER_BACK: BodyRegion = {
  id: 'lower-back',
  label: 'Lower Back',
  termIds: ['sk-009', 'sk-010', 'nv-002'],
  rect: [600, 375, 208, 110],
}

const BUTTOCKS: BodyRegion = {
  id: 'buttocks',
  label: 'Buttocks',
  termIds: ['sk-024', 'sk-025', 'mu-009'],
  rect: [620, 485, 168, 75],
}

const ANTERIOR_REGIONS: BodyRegion[] = [
  HEAD, NECK, CHEST, ABDOMEN, PELVIS,
  LEFT_UPPER_ARM, LEFT_FOREARM, LEFT_HAND,
  RIGHT_UPPER_ARM, RIGHT_FOREARM, RIGHT_HAND,
  LEFT_THIGH, LEFT_LEG, LEFT_FOOT,
  RIGHT_THIGH, RIGHT_LEG, RIGHT_FOOT,
]

const POSTERIOR_REGIONS: BodyRegion[] = [
  HEAD, NECK, UPPER_BACK, LOWER_BACK, BUTTOCKS,
  LEFT_UPPER_ARM, LEFT_FOREARM, LEFT_HAND,
  RIGHT_UPPER_ARM, RIGHT_FOREARM, RIGHT_HAND,
  LEFT_THIGH, LEFT_LEG, LEFT_FOOT,
  RIGHT_THIGH, RIGHT_LEG, RIGHT_FOOT,
]

export const bodyViews: BodyView[] = [
  {
    imageFile: 'male-anterior.png',
    label: 'Male · Anterior',
    regions: ANTERIOR_REGIONS,
  },
  {
    imageFile: 'male-posterior.png',
    label: 'Male · Posterior',
    regions: POSTERIOR_REGIONS,
  },
  {
    imageFile: 'female-anterior.png',
    label: 'Female · Anterior',
    regions: ANTERIOR_REGIONS,
  },
  {
    imageFile: 'female-posterior.png',
    label: 'Female · Posterior',
    regions: POSTERIOR_REGIONS,
  },
]
