describe('MZ library test',function(){
    describe('test $ function',function(){
        it('can get elements by id',function(){
            var el = document.getElementById('one');
            expect(MZ.$('#one')[0]).toEqual(el);
        });

        it('can get elements by class',function(){
            expect(MZ.$('.two').length).toEqual(3);
        });

        it('can get elements by tagName',function(){
            expect(MZ.$('b').length).toEqual(4);
        });

        it('create MZ Dom Object from a single node',function(){
            var one = document.getElementById('one');
            expect(MZ.$(one)[0]).toEqual(one)
        });

        it('create MZ Dom Object from a NodeList',function(){
            var two = document.querySelectorAll('.two');
            expect(MZ.$(two)[0]).toEqual(two[0]);
        });
    });

    describe('test MZ Dom util',function(){
        it('can loop over each element',function(){
            var o = {
                loop:function(el){
                    console.log(el.className);
                }
            }
            // 注册一个函数，并监听它是否被调用
            spyOn(o,'loop');
            MZ.$('#elements b').forEach(o.loop);
            expect(o.loop).toHaveBeenCalled();
        });

        it('can map over each element',function(){
            var a = MZ.$('.two').map(function(el){
                return el.className;
            });
            expect(a.join('')).toEqual('twotwotwo');
        });
    });

    describe('test MZ Dom text',function(){
        beforeEach(function(){
            this.d = MZ.$('#one');
        });

        it('can set the text of an element',function(){
            this.d.text('one');
            expect(this.d[0].innerText).toEqual('one');
        });

        it('can get the text of an elment',function(){
            this.d.text('one');
            expect(this.d.text()).toEqual('one');
        });
    });

    describe('test MZ Dom html',function(){
        beforeEach(function(){
            this.d = MZ.$('#one');
        });

        afterEach(function(){
            this.d.html('');
        });

        it('can set the html of an element',function(){
            this.d.html('<span>hello world</span>');
            expect(this.d[0].innerHTML.toLowerCase()).toEqual('<span>hello world</span>');
        });

        it('can get the html of an element',function(){
            this.d.html('<span>hello world</span>');
            expect(this.d.html().toLowerCase()).toEqual('<span>hello world</span>');
        });
    });

    describe('test MZ Dom addClas',function(){
        beforeEach(function(){
            this.d = MZ.$('.two');
        });

        afterEach(function(){
            this.d.forEach(function(el){
                el.className = 'two';
            });
        });

        it('can add a single class to elements',function(){
            this.d.addClass('single');
            expect(this.d[0].className.indexOf('single')).toBeGreaterThan(-1);
        });

        it('can add multiple classed (via array) to elements',function(){
            this.d.addClass(['multiple','classes']);
            var cn = this.d[0].className;
            expect(cn.indexOf('multiple')).toBeLessThan(cn.indexOf('classes'));
        });
    });

});