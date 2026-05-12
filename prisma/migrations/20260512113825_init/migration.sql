-- CreateTable
CREATE TABLE `tb_dosen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nidn` VARCHAR(30) NOT NULL,
    `nama_dosen` VARCHAR(150) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `no_hp` VARCHAR(20) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tb_dosen_nidn_key`(`nidn`),
    UNIQUE INDEX `tb_dosen_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_mahasiswa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nim` VARCHAR(20) NOT NULL,
    `nama_mahasiswa` VARCHAR(150) NOT NULL,
    `prodi` VARCHAR(100) NOT NULL,
    `angkatan` INTEGER NOT NULL,
    `dosen_pa_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tb_mahasiswa_nim_key`(`nim`),
    INDEX `tb_mahasiswa_dosen_pa_id_idx`(`dosen_pa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tb_mahasiswa` ADD CONSTRAINT `tb_mahasiswa_dosen_pa_id_fkey` FOREIGN KEY (`dosen_pa_id`) REFERENCES `tb_dosen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
