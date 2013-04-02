class NotesController < ApplicationController
  def index
  	@notes = Notes.order("created_at desc")
  end
  def create
  	@note = Notes.create(params[:note])
  end
end
