import { MigrationInterface, QueryRunner } from "typeorm";

export class createAccount1667960872639 implements MigrationInterface {
    name = 'createAccount1667960872639'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`account\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(128) NOT NULL, \`type\` enum ('0', '1') NOT NULL DEFAULT '0', \`enabled\` tinyint NOT NULL DEFAULT 1, \`currency\` enum ('AFN', 'ALL', 'DZD', 'ARS', 'AMD', 'AUD', 'AZN', 'BHD', 'BDT', 'BYN', 'BZD', 'BOB', 'BAM', 'BWP', 'BRL', 'GBP', 'BND', 'BGN', 'BIF', 'KHR', 'CAD', 'CVE', 'XAF', 'CLP', 'CNY', 'COP', 'KMF', 'CDF', 'CRC', 'HRK', 'CZK', 'DKK', 'DJF', 'DOP', 'EGP', 'ERN', 'EEK', 'ETB', 'EUR', 'GEL', 'GHS', 'GTQ', 'GNF', 'HNL', 'HKD', 'HUF', 'ISK', 'INR', 'IDR', 'IRR', 'IQD', 'ILS', 'JMD', 'JPY', 'JOD', 'KZT', 'KES', 'KWD', 'LVL', 'LBP', 'LYD', 'LTL', 'MOP', 'MKD', 'MGA', 'MYR', 'MUR', 'MXN', 'MDL', 'MAD', 'MZN', 'MMK', 'NAD', 'NPR', 'TWD', 'NZD', 'NIO', 'NGN', 'NOK', 'OMR', 'PKR', 'PAB', 'PYG', 'PEN', 'PHP', 'PLN', 'QAR', 'RON', 'RUB', 'RWF', 'SAR', 'RSD', 'SGD', 'SOS', 'ZAR', 'KRW', 'LKR', 'SDG', 'SEK', 'CHF', 'SYP', 'TZS', 'THB', 'TOP', 'TTD', 'TND', 'TRY', 'USD', 'UGX', 'UAH', 'AED', 'UYU', 'UZS', 'VEF', 'VND', 'XOF', 'YER', 'ZMK', 'ZWL') NOT NULL, \`balance\` decimal(20,8) NOT NULL DEFAULT '0.00000000', \`created\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX \`IDX_d8c55e099448138f885b2959f9\` (\`enabled\`), INDEX \`IDX_cadbb8e77137bed00eab83ab81\` (\`created\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`deposit_withdraw_ledger\` (\`id\` int NOT NULL AUTO_INCREMENT, \`amount\` decimal(20,8) NOT NULL DEFAULT '0.00000000', \`note\` varchar(256) NOT NULL, \`created\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`type\` enum ('0', '1') NOT NULL DEFAULT '0', \`accountId\` int NOT NULL, INDEX \`IDX_fc00412b4262b3eae1d2ab8b1e\` (\`created\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`transfer_ledger\` (\`id\` int NOT NULL AUTO_INCREMENT, \`amount\` decimal(20,8) NOT NULL DEFAULT '0.00000000', \`note\` varchar(256) NOT NULL, \`created\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`fromAccountId\` int NOT NULL, \`toAccountId\` int NOT NULL, INDEX \`IDX_c8c96cdf10ef6477801cb7e74c\` (\`created\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`deposit_withdraw_ledger\` ADD CONSTRAINT \`FK_2bebca33ce550b18a0d27fa8551\` FOREIGN KEY (\`accountId\`) REFERENCES \`account\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transfer_ledger\` ADD CONSTRAINT \`FK_3eaa9a16381f850da711de796ac\` FOREIGN KEY (\`fromAccountId\`) REFERENCES \`account\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transfer_ledger\` ADD CONSTRAINT \`FK_b52d062de2697fb2051180af8f6\` FOREIGN KEY (\`toAccountId\`) REFERENCES \`account\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transfer_ledger\` DROP FOREIGN KEY \`FK_b52d062de2697fb2051180af8f6\``);
        await queryRunner.query(`ALTER TABLE \`transfer_ledger\` DROP FOREIGN KEY \`FK_3eaa9a16381f850da711de796ac\``);
        await queryRunner.query(`ALTER TABLE \`deposit_withdraw_ledger\` DROP FOREIGN KEY \`FK_2bebca33ce550b18a0d27fa8551\``);
        await queryRunner.query(`DROP INDEX \`IDX_c8c96cdf10ef6477801cb7e74c\` ON \`transfer_ledger\``);
        await queryRunner.query(`DROP TABLE \`transfer_ledger\``);
        await queryRunner.query(`DROP INDEX \`IDX_fc00412b4262b3eae1d2ab8b1e\` ON \`deposit_withdraw_ledger\``);
        await queryRunner.query(`DROP TABLE \`deposit_withdraw_ledger\``);
        await queryRunner.query(`DROP INDEX \`IDX_cadbb8e77137bed00eab83ab81\` ON \`account\``);
        await queryRunner.query(`DROP INDEX \`IDX_d8c55e099448138f885b2959f9\` ON \`account\``);
        await queryRunner.query(`DROP TABLE \`account\``);
    }

}
