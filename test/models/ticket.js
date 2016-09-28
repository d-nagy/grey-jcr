var Ticket = require('../../models/ticket');
var db = require('../../helpers/db');

var expect = require("chai").expect;

describe('Static Ticket Methods', function() {
    var test_ticket_id = null;

    beforeEach(function(done) {
        db('tickets').insert({
            name: "Test Ticket",
            max_booking: 4,
            min_booking: 1,
            allow_debtors: true,
            allow_guests: true,
            open_booking: new Date(2016, 7, 1),
            close_booking: new Date(2016, 8, 1),
            price: 500,
            guest_surcharge: 100,
            stock: 10
        }).returning('id').then(function(id) {
            test_ticket_id = id[0];
            done();
        });
    });

    afterEach(function(done) {
        db('tickets').del().then(function() {
            test_ticket_id = null;
            done();
        });
    })

    it("can find feedback by id", function(done) {
        Ticket.findById(test_ticket_id).then(function(ticket){
            expect(ticket.name).to.equal("Test Ticket");
            done();
        }).catch(function(err){
            done(err);
        })
    });

    it("can get all tickets", function(done) {
        Ticket.getAll().then(function(tickets) {
            expect(tickets).to.have.length(1);
            done();
        }).catch(function(err){
            done(err);
        })
    });

    it("can create new ticket", function(done) {
        Ticket.create("Fake Ticket").then(function(ticket) {
            expect(ticket.name).to.equal("Fake Ticket");
            done();
        }).catch(function(err){
            done(err);
        })
    })
});

describe('Ticket Object', function() {
    var test_ticket = null;

    beforeEach(function(done) {
        var now = new Date();
        db('tickets').insert({
            name: "Test Ticket",
            max_booking: 4,
            min_booking: 1,
            allow_debtors: true,
            allow_guests: true,
            open_booking: new Date(2016, 7, 1),
            close_booking: new Date(2016, 8, 1),
            price: 500,
            guest_surcharge: 100,
            stock: 10
        }).returning('id').then(function(id) {
            test_ticket = new Ticket({
                id: id[0],
                name: "Test Ticket",
                max_booking: 4,
                min_booking: 1,
                allow_debtors: true,
                allow_guests: true,
                open_booking: new Date(2016, 7, 1),
                close_booking: new Date(2016, 8, 1),
                price: 500,
                guest_surcharge: 100,
                stock: 10
            });
            done();
        });
    });

    afterEach(function(done) {
        db('tickets').del().then(function() {
            test_ticket = null;
            done();
        });
    })

    it('can update itself', function(done){
        test_ticket.update("Updated Test Ticket", {
            max_booking: 8,
            min_booking: 1,
            allow_debtors: true,
            allow_guests: true,
            open_booking: new Date(2016, 7, 1),
            close_booking: new Date(2016, 8, 1),
            price: 500,
            guest_surcharge: 100,
            stock: 20
        }).then(function() {
            expect(this.name).to.equal("Updated Test Ticket");
            expect(this.max_booking).to.equal(8);
            expect(this.stock).to.equal(20);
            done();
        }).catch(function(err){
            done(err);
        });
    });

    it('can delete itself', function(done){
        test_ticket.delete().then(function() {
            return db('tickets').select();
        }).then(function(tickets){
            expect(tickets).to.have.length(0);
            done();
        }).catch(function(err){
            done(err);
        })
    });

    it("can get associated events", function(done) {
        db('event_tickets').insert({
            event_id: null,
            ticket_id: test_ticket.id
        }).then(function(){
            return test_ticket.getEvents();
        }).then(function(tickets) {
            expect(tickets).to.have.length(1);
            done();
        }).catch(function(err){
            done(err);
        });
    })
});
