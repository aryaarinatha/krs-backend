export const CacheKeys = {
  DOSEN_ALL: 'dosen:all',
  DOSEN_DETAIL: (id: number | string): string => `dosen:detail:${id}`,
  DOSEN_MAHASISWA: (id: number | string): string => `dosen:${id}:mahasiswa`,

  MAHASISWA_ALL: 'mahasiswa:all',
  MAHASISWA_DETAIL: (id: number | string): string => `mahasiswa:detail:${id}`,

  PEMETAAN_PA_ALL: 'pemetaan-pa:all',
};
