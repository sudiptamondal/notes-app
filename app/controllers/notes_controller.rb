class NotesController < ApplicationController
  def index
  	@notes = Notes.all
  end
  def create
  	@note = Notes.create(params[:note])
  end
end
