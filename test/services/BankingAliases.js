var expect = require('chai').expect;
var helpers = require('../helpers');

describe('Banking Aliases', function() {
    var john = helpers.data.getUserNatural();
    var bankingAlias;

    before(function(done) {
        api.Users.create(john).then(function(){
            wallet = {
                Owners: [john.Id],
                Currency: 'EUR',
                Description: 'WALLET IN EUR'
            };
            api.Wallets.create(wallet).then(function(){
                bankingAlias = new api.models.BankingAliasIBAN({
                    CreditedUserId: john.Id,
                    WalletId: wallet.Id,
                    OwnerName: john.FirstName,
                    Country: 'IT'

                });
                api.BankingAliases.create(bankingAlias).then(done);
            });
        });
    });

    it('should exist after creting it', function () {
        expect(bankingAlias.Id).to.exist;
    });

    describe('Getting created banking alias', function () {
        var getBankingAlias;

        before(function(done){
            api.BankingAliases.get(bankingAlias.Id).then(function(data, response){
                getBankingAlias = data;
                done();
            });
        });

        it('should be correctly fetched', function () {
            expect(bankingAlias.Id).to.equal(getBankingAlias.Id);
            expect(bankingAlias.WalletId).to.equal(getBankingAlias.WalletId);
            expect(bankingAlias.OwnerName).to.equal(getBankingAlias.OwnerName);
            expect(bankingAlias.CreditedUserId).to.equal(getBankingAlias.CreditedUserId);
            expect(bankingAlias.CreationDate).to.equal(getBankingAlias.CreationDate);
        });
    });

    describe('Deactivate the Bank Alias', function () {
        var deactivatedBankingAlias;

        before(function(done){
            api.BankingAliases.deactivate(bankingAlias.Id).then(function(data, response){
                api.BankingAliases.get(bankingAlias.Id).then(function(data, response){
                    deactivatedBankingAlias = data;
                    done();
                });
            });

        });

        it('should have the right activated flag', function () {
            expect(deactivatedBankingAlias.Id).to.equal(bankingAlias.Id);
            expect(deactivatedBankingAlias.Active).to.equal(false);
        });
    });
});
