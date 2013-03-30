# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/

$ ->
	$(document).on 'click','a[href=#newNote]', ->
		$("#newNote").removeClass("fade").removeClass("hide")
	$(document).on 'click','#cancel', ->
		$("#newNote").addClass("fade").addClass("hide")
	$(document).on 'click','#ara', ->	
		$("#note_user_id").val('1')	
	$(document).on 'click','#shuiab', ->
		$("#note_user_id").val('2')
	$(document).on 'click','#me', ->
		$("#note_user_id").val('3')