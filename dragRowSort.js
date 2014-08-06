(function(angular) {
    
    var app = angular.module('app');

    app.directive('dragDropRowSort', ['$window', 
        /*
         *  Drag 'n drop table rows directive
         *  TODO:
         *      - Remove jQuery dependency
         *      - Tell service that the order has changed
         */
        function($window) {
        'use strict';

        function onDragDrop($event) {
            $event.preventDefault();
            var $target = $($event.target),
                $parent = $target.parents('tr:first'),
                $element = $('#' + $event.originalEvent.dataTransfer.getData("text"));

            $element.insertBefore($parent);  
            $element.trigger('rowDropped');      
        }

        function dummyDragOver($event) {
            $event.preventDefault();
        }

        function onDragEnd($event) {
            $event.preventDefault();
            $('.table-drag-drop-row').remove();
        }

        function generateDropRow($row) {
            var dropRow = $row
                .clone()
                .addClass('table-drag-drop-row')
                .css('height', '30px');

            dropRow
                .children('td')
                .each(function(index, element) {
                    $(this).empty();
                });

            dropRow
                .attr('draggable', 'false')            
                .on('dragover', dummyDragOver)            
                .on('drop', onDragDrop);

            return dropRow;
        }

        function onDragOver($event) {
            $event.preventDefault();            
            var $target = $($event.target),
                $tbody = $target.parents('tbody:first'),
                $row = $target.parents('tr:first');

            $tbody.find('.table-drag-drop-row').remove();        

            $row.before(generateDropRow($row));
            $row.after(generateDropRow($row));
        }

        function onDragStart($event) {
            var $target = $($event.target),
                identification = $target.attr('id');

            $event.originalEvent.dataTransfer.setData("text", identification);                    
        }

        function bindEvents(index, element) {        
            element
                .attr('id', index)
                .attr('draggable', 'true')
                .on('dragstart', onDragStart)
                .on('dragover', onDragOver)
                .on('dragend', onDragEnd)
                .on('drop', onDragDrop);
        }

        function link(scope, element, attrs) {
            bindEvents(scope.$index, element);
            element.on('rowDropped', function(event, args) {
                scope.$emit('table-row-drag-sorted');
            });                            
        }

        return {
            restrict: 'A',
            link: link
        };
    }]);

})(angular);